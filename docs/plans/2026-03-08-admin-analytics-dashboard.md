# Admin Analytics Dashboard Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a password-protected admin dashboard at `/admin` that displays real page view analytics and form submission data, backed by Vercel Postgres.

**Architecture:** Custom lightweight page-view tracker (client component) sends events to an API route that writes to Vercel Postgres. Contact form submissions are stored in the same database. The `/admin` route is protected by middleware that checks a session cookie set via a simple password login page. The dashboard uses server components to query Postgres directly.

**Tech Stack:** Next.js 16 App Router, Vercel Postgres (`@vercel/postgres`), `bcryptjs` for password hashing, HTTP-only cookies for session, Tailwind CSS 4

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install Vercel Postgres and bcryptjs**

```bash
npm install @vercel/postgres bcryptjs
npm install -D @types/bcryptjs
```

**Step 2: Verify installation**

Run: `npm ls @vercel/postgres bcryptjs`
Expected: Both packages listed without errors

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add vercel postgres and bcryptjs dependencies"
```

---

### Task 2: Database Schema Setup Script

**Files:**
- Create: `lib/db/schema.ts`
- Create: `lib/db/seed.ts`

**Step 1: Create the schema file**

`lib/db/schema.ts` — exports a function that creates three tables:

```typescript
import { sql } from "@vercel/postgres";

export async function createTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS page_views (
      id SERIAL PRIMARY KEY,
      path VARCHAR(500) NOT NULL,
      referrer VARCHAR(1000),
      user_agent VARCHAR(1000),
      visitor_id VARCHAR(64),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views (created_at)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views (path)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON page_views (visitor_id)
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS form_submissions (
      id SERIAL PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      email VARCHAR(200) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      service VARCHAR(50) NOT NULL,
      preferred_date DATE,
      message TEXT NOT NULL,
      items TEXT,
      supplies TEXT,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS admin_sessions (
      id SERIAL PRIMARY KEY,
      token VARCHAR(64) UNIQUE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL
    )
  `;
}
```

**Step 2: Create the seed/setup API route**

`lib/db/seed.ts`:

```typescript
import { createTables } from "./schema";

export async function seedDatabase() {
  await createTables();
  return { success: true };
}
```

**Step 3: Create the setup API route**

Create `app/api/setup/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { seedDatabase } from "@/lib/db/seed";

export async function GET() {
  try {
    await seedDatabase();
    return NextResponse.json({ message: "Database tables created successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create tables", details: String(error) },
      { status: 500 }
    );
  }
}
```

**Step 4: Commit**

```bash
git add lib/db/ app/api/setup/
git commit -m "feat: add database schema and setup route"
```

---

### Task 3: Page View Tracking API Route

**Files:**
- Create: `app/api/track/route.ts`

**Step 1: Create the tracking endpoint**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(request: NextRequest) {
  try {
    const { path, referrer, visitorId } = await request.json();

    if (!path) {
      return NextResponse.json({ error: "Path required" }, { status: 400 });
    }

    const userAgent = request.headers.get("user-agent") || "";

    // Skip bots
    if (/bot|crawler|spider|crawling/i.test(userAgent)) {
      return NextResponse.json({ ok: true });
    }

    await sql`
      INSERT INTO page_views (path, referrer, user_agent, visitor_id)
      VALUES (${path}, ${referrer || null}, ${userAgent}, ${visitorId || null})
    `;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Track error:", error);
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }
}
```

**Step 2: Commit**

```bash
git add app/api/track/
git commit -m "feat: add page view tracking API route"
```

---

### Task 4: Page View Tracker Client Component

**Files:**
- Create: `components/PageViewTracker.tsx`
- Modify: `app/layout.tsx` — add tracker to body

**Step 1: Create the tracker component**

```typescript
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

function getVisitorId(): string {
  const key = "ffm_vid";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export default function PageViewTracker() {
  const pathname = usePathname();
  const lastPath = useRef("");

  useEffect(() => {
    if (pathname === lastPath.current) return;
    if (pathname.startsWith("/admin")) return;
    lastPath.current = pathname;

    try {
      const visitorId = getVisitorId();
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: pathname,
          referrer: document.referrer || null,
          visitorId,
        }),
      }).catch(() => {}); // Fire and forget
    } catch {
      // Silently fail — analytics should never break the site
    }
  }, [pathname]);

  return null;
}
```

**Step 2: Add tracker to layout**

In `app/layout.tsx`, import and add `<PageViewTracker />` inside `<body>` after `<Footer />`:

```typescript
import PageViewTracker from "@/components/PageViewTracker";

// Inside body, after <Footer />:
<PageViewTracker />
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Compiles successfully

**Step 4: Commit**

```bash
git add components/PageViewTracker.tsx app/layout.tsx
git commit -m "feat: add client-side page view tracker"
```

---

### Task 5: Form Submission API Route

**Files:**
- Create: `app/api/contact/route.ts`
- Modify: `components/ContactForm.tsx` — wire up to real API

**Step 1: Create the contact API route**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const { name, email, phone, service, date, message, items, supplies } = data;

    if (!name || !email || !phone || !service || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await sql`
      INSERT INTO form_submissions (name, email, phone, service, preferred_date, message, items, supplies)
      VALUES (
        ${name},
        ${email},
        ${phone},
        ${service},
        ${date || null},
        ${message},
        ${items || null},
        ${supplies || null}
      )
    `;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
```

**Step 2: Update ContactForm to POST to the API**

Replace the `handleSubmit` function in `components/ContactForm.tsx`:

```typescript
async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setIsSubmitting(true);

  const formData = new FormData(e.currentTarget);

  // Collect checkbox values
  const items = ITEMS_TO_MOVE
    .filter((item) => formData.get(`item-${item.toLowerCase().replace(/\s+/g, "-")}`) === "on")
    .join(", ");

  const supplies = ["Mattress Boxes", "Wardrobe Boxes", "Packing Supplies (tape, paper, etc.)"]
    .filter((item) => formData.get(`supplies-${item.toLowerCase().replace(/[\s(),.]+/g, "-")}`) === "on")
    .join(", ");

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        service: formData.get("service"),
        date: formData.get("date") || null,
        message: formData.get("message"),
        items: items || null,
        supplies: supplies || null,
      }),
    });

    if (!res.ok) throw new Error("Submission failed");
    setIsSubmitted(true);
  } catch {
    alert("Something went wrong. Please try calling us directly.");
  } finally {
    setIsSubmitting(false);
  }
}
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Compiles successfully

**Step 4: Commit**

```bash
git add app/api/contact/ components/ContactForm.tsx
git commit -m "feat: wire contact form to postgres storage"
```

---

### Task 6: Admin Authentication

**Files:**
- Create: `app/api/admin/login/route.ts`
- Create: `app/api/admin/logout/route.ts`
- Create: `app/api/admin/check/route.ts`
- Create: `lib/auth.ts`

**Step 1: Create auth utility**

`lib/auth.ts`:

```typescript
import { cookies } from "next/headers";
import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function verifyPassword(password: string): Promise<boolean> {
  const adminHash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminHash) return false;
  return bcrypt.compare(password, adminHash);
}

export async function createSession(): Promise<string> {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await sql`
    INSERT INTO admin_sessions (token, expires_at)
    VALUES (${token}, ${expiresAt.toISOString()})
  `;

  return token;
}

export async function validateSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) return false;

  const result = await sql`
    SELECT id FROM admin_sessions
    WHERE token = ${token} AND expires_at > NOW()
    LIMIT 1
  `;

  return result.rows.length > 0;
}

export async function deleteSession(token: string) {
  await sql`DELETE FROM admin_sessions WHERE token = ${token}`;
}

// Helper: generate a hash for initial setup
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}
```

**Step 2: Create login route**

`app/api/admin/login/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password || !(await verifyPassword(password))) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = await createSession();

    const response = NextResponse.json({ ok: true });
    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
```

**Step 3: Create logout route**

`app/api/admin/logout/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("admin_session")?.value;
  if (token) await deleteSession(token);

  const response = NextResponse.json({ ok: true });
  response.cookies.delete("admin_session");
  return response;
}
```

**Step 4: Create session check route**

`app/api/admin/check/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { validateSession } from "@/lib/auth";

export async function GET() {
  const valid = await validateSession();
  return NextResponse.json({ authenticated: valid });
}
```

**Step 5: Commit**

```bash
git add lib/auth.ts app/api/admin/
git commit -m "feat: add admin session auth with bcrypt"
```

---

### Task 7: Admin Middleware (Route Protection)

**Files:**
- Create: `middleware.ts` (project root)

**Step 1: Create middleware**

```typescript
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (not /api/admin/login)
  if (pathname.startsWith("/admin")) {
    const session = request.cookies.get("admin_session")?.value;
    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/((?!login).*)"],
};
```

**Step 2: Commit**

```bash
git add middleware.ts
git commit -m "feat: add middleware to protect admin routes"
```

---

### Task 8: Admin Login Page

**Files:**
- Create: `app/admin/login/page.tsx`
- Create: `app/admin/layout.tsx`

**Step 1: Create admin layout (no Header/Footer)**

`app/admin/layout.tsx`:

```typescript
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
```

Override the root layout for admin pages by using a route group. Actually, since Next.js App Router nests layouts, the admin layout will still include the root layout's Header/Footer. To avoid that, we need a different approach — we'll conditionally hide Header/Footer based on pathname.

Better approach: Create `app/admin/layout.tsx` that wraps children in a full-screen admin shell, and modify the root layout to conditionally exclude Header/Footer for admin routes. Since root layout is a server component and can't read pathname, we'll use a wrapper component.

Simpler: Create `app/(site)/layout.tsx` for the public site with Header/Footer, and `app/(admin)/admin/layout.tsx` for admin. Move existing pages into `(site)` route group.

**Simplest approach:** Keep the root layout minimal and use route groups:

Actually, the simplest working approach: the admin layout will just render its own full-page UI, and the Header/Footer from root layout will show but the admin page will be styled to overlay/cover them.

**Best approach without restructuring:** Add a `AdminShell` wrapper that renders a full-screen fixed overlay:

`app/admin/layout.tsx`:

```typescript
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[100] bg-charcoal-900 overflow-auto">
      {children}
    </div>
  );
}
```

**Step 2: Create login page**

`app/admin/login/page.tsx`:

```typescript
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Image
            src="/logo/FFM.Final.png"
            alt="Finn's Family Moving"
            width={60}
            height={60}
            className="w-14 h-14"
          />
        </div>
        <h1 className="text-xl font-bold text-white text-center mb-1">
          Admin Dashboard
        </h1>
        <p className="text-charcoal-400 text-sm text-center mb-8">
          Enter your password to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-3 bg-charcoal-800 border border-charcoal-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-warm-500/30 focus:border-warm-600 outline-none transition-all placeholder:text-charcoal-500"
          />
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-warm-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-warm-700 transition-colors disabled:bg-charcoal-700 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Compiles successfully

**Step 4: Commit**

```bash
git add app/admin/
git commit -m "feat: add admin login page and admin layout"
```

---

### Task 9: Analytics Query Functions

**Files:**
- Create: `lib/db/analytics.ts`

**Step 1: Create analytics query helpers**

```typescript
import { sql } from "@vercel/postgres";

export async function getPageViewStats(days: number = 30) {
  const result = await sql`
    SELECT
      DATE(created_at AT TIME ZONE 'America/Chicago') as date,
      COUNT(*) as views,
      COUNT(DISTINCT visitor_id) as visitors
    FROM page_views
    WHERE created_at > NOW() - INTERVAL '1 day' * ${days}
    GROUP BY DATE(created_at AT TIME ZONE 'America/Chicago')
    ORDER BY date DESC
  `;
  return result.rows;
}

export async function getTopPages(days: number = 30) {
  const result = await sql`
    SELECT
      path,
      COUNT(*) as views,
      COUNT(DISTINCT visitor_id) as visitors
    FROM page_views
    WHERE created_at > NOW() - INTERVAL '1 day' * ${days}
    GROUP BY path
    ORDER BY views DESC
    LIMIT 10
  `;
  return result.rows;
}

export async function getTotalStats(days: number = 30) {
  const result = await sql`
    SELECT
      COUNT(*) as total_views,
      COUNT(DISTINCT visitor_id) as total_visitors
    FROM page_views
    WHERE created_at > NOW() - INTERVAL '1 day' * ${days}
  `;
  return result.rows[0];
}

export async function getTodayStats() {
  const result = await sql`
    SELECT
      COUNT(*) as views,
      COUNT(DISTINCT visitor_id) as visitors
    FROM page_views
    WHERE DATE(created_at AT TIME ZONE 'America/Chicago') = CURRENT_DATE
  `;
  return result.rows[0];
}

export async function getRecentSubmissions(limit: number = 20) {
  const result = await sql`
    SELECT * FROM form_submissions
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return result.rows;
}

export async function getSubmissionCount() {
  const result = await sql`
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE NOT is_read) as unread
    FROM form_submissions
  `;
  return result.rows[0];
}

export async function markSubmissionRead(id: number) {
  await sql`UPDATE form_submissions SET is_read = TRUE WHERE id = ${id}`;
}

export async function getViewsPerDay(days: number = 7) {
  const result = await sql`
    SELECT
      DATE(created_at AT TIME ZONE 'America/Chicago') as date,
      COUNT(*) as views
    FROM page_views
    WHERE created_at > NOW() - INTERVAL '1 day' * ${days}
    GROUP BY DATE(created_at AT TIME ZONE 'America/Chicago')
    ORDER BY date ASC
  `;
  return result.rows;
}

export async function getReferrerStats(days: number = 30) {
  const result = await sql`
    SELECT
      COALESCE(referrer, 'Direct') as referrer,
      COUNT(*) as views
    FROM page_views
    WHERE created_at > NOW() - INTERVAL '1 day' * ${days}
    GROUP BY referrer
    ORDER BY views DESC
    LIMIT 10
  `;
  return result.rows;
}
```

**Step 2: Commit**

```bash
git add lib/db/analytics.ts
git commit -m "feat: add analytics query functions"
```

---

### Task 10: Admin Dashboard Page

**Files:**
- Create: `app/admin/page.tsx`
- Create: `components/admin/StatsCard.tsx`
- Create: `components/admin/SubmissionsTable.tsx`
- Create: `components/admin/SimpleBarChart.tsx`
- Create: `components/admin/AdminHeader.tsx`

**Step 1: Create AdminHeader**

`components/admin/AdminHeader.tsx`:

```typescript
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminHeader() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <header className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-charcoal-800">
      <div className="flex items-center gap-3">
        <Image
          src="/logo/FFM.Final.png"
          alt="Logo"
          width={36}
          height={36}
          className="w-9 h-9"
        />
        <div>
          <span className="text-sm font-bold text-white">FFM Admin</span>
          <span className="text-xs text-charcoal-500 ml-2">Dashboard</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <a
          href="/"
          target="_blank"
          className="text-xs text-charcoal-400 hover:text-white transition-colors"
        >
          View Site
        </a>
        <button
          onClick={handleLogout}
          className="text-xs text-charcoal-400 hover:text-red-400 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
```

**Step 2: Create StatsCard**

`components/admin/StatsCard.tsx`:

```typescript
export default function StatsCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="bg-charcoal-800 rounded-2xl p-6 border border-charcoal-700">
      <p className="text-xs font-medium uppercase tracking-wider text-charcoal-400 mb-1">
        {label}
      </p>
      <p className="text-3xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-charcoal-500 mt-1">{sub}</p>}
    </div>
  );
}
```

**Step 3: Create SimpleBarChart**

`components/admin/SimpleBarChart.tsx`:

```typescript
export default function SimpleBarChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-2">
      {data.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="text-xs text-charcoal-400 w-20 text-right shrink-0">
            {item.label}
          </span>
          <div className="flex-1 h-7 bg-charcoal-800 rounded-lg overflow-hidden">
            <div
              className="h-full bg-warm-600 rounded-lg flex items-center px-2 transition-all duration-500"
              style={{ width: `${Math.max((item.value / max) * 100, 2)}%` }}
            >
              <span className="text-[10px] font-semibold text-white">
                {item.value}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

**Step 4: Create SubmissionsTable**

`components/admin/SubmissionsTable.tsx`:

```typescript
"use client";

import { useState } from "react";

interface Submission {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  preferred_date: string | null;
  message: string;
  items: string | null;
  supplies: string | null;
  is_read: boolean;
  created_at: string;
}

export default function SubmissionsTable({
  submissions,
}: {
  submissions: Submission[];
}) {
  const [expanded, setExpanded] = useState<number | null>(null);

  async function markRead(id: number) {
    await fetch(`/api/admin/submissions/${id}/read`, { method: "POST" });
  }

  return (
    <div className="space-y-2">
      {submissions.length === 0 && (
        <p className="text-charcoal-500 text-sm py-8 text-center">
          No submissions yet
        </p>
      )}
      {submissions.map((sub) => (
        <div
          key={sub.id}
          className={`bg-charcoal-800 rounded-xl border transition-colors ${
            sub.is_read ? "border-charcoal-700" : "border-warm-600/40"
          }`}
        >
          <button
            onClick={() => {
              setExpanded(expanded === sub.id ? null : sub.id);
              if (!sub.is_read) markRead(sub.id);
            }}
            className="w-full px-5 py-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              {!sub.is_read && (
                <span className="w-2 h-2 bg-warm-500 rounded-full flex-shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {sub.name}
                </p>
                <p className="text-xs text-charcoal-400 truncate">
                  {sub.service} &middot;{" "}
                  {new Date(sub.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <svg
              className={`w-4 h-4 text-charcoal-500 transition-transform ${
                expanded === sub.id ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {expanded === sub.id && (
            <div className="px-5 pb-5 space-y-3 border-t border-charcoal-700 pt-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-charcoal-500 text-xs">Email</p>
                  <a
                    href={`mailto:${sub.email}`}
                    className="text-warm-400 hover:underline"
                  >
                    {sub.email}
                  </a>
                </div>
                <div>
                  <p className="text-charcoal-500 text-xs">Phone</p>
                  <a
                    href={`tel:${sub.phone}`}
                    className="text-warm-400 hover:underline"
                  >
                    {sub.phone}
                  </a>
                </div>
                {sub.preferred_date && (
                  <div>
                    <p className="text-charcoal-500 text-xs">Preferred Date</p>
                    <p className="text-charcoal-200">
                      {new Date(sub.preferred_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-charcoal-500 text-xs">Service</p>
                  <p className="text-charcoal-200">{sub.service}</p>
                </div>
              </div>
              {sub.items && (
                <div>
                  <p className="text-charcoal-500 text-xs mb-1">Items</p>
                  <p className="text-charcoal-200 text-sm">{sub.items}</p>
                </div>
              )}
              {sub.supplies && (
                <div>
                  <p className="text-charcoal-500 text-xs mb-1">Supplies</p>
                  <p className="text-charcoal-200 text-sm">{sub.supplies}</p>
                </div>
              )}
              <div>
                <p className="text-charcoal-500 text-xs mb-1">Message</p>
                <p className="text-charcoal-200 text-sm">{sub.message}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

**Step 5: Create the main admin dashboard page**

`app/admin/page.tsx`:

```typescript
import { validateSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getTotalStats,
  getTodayStats,
  getTopPages,
  getRecentSubmissions,
  getSubmissionCount,
  getViewsPerDay,
  getReferrerStats,
} from "@/lib/db/analytics";
import StatsCard from "@/components/admin/StatsCard";
import SimpleBarChart from "@/components/admin/SimpleBarChart";
import SubmissionsTable from "@/components/admin/SubmissionsTable";
import AdminHeader from "@/components/admin/AdminHeader";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const isAuth = await validateSession();
  if (!isAuth) redirect("/admin/login");

  const [totalStats, todayStats, topPages, submissions, subCount, viewsPerDay, referrers] =
    await Promise.all([
      getTotalStats(30),
      getTodayStats(),
      getTopPages(30),
      getRecentSubmissions(50),
      getSubmissionCount(),
      getViewsPerDay(14),
      getReferrerStats(30),
    ]);

  const chartData = viewsPerDay.map((row: { date: string; views: string | number }) => ({
    label: new Date(row.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: Number(row.views),
  }));

  const pageData = topPages.map((row: { path: string; views: string | number }) => ({
    label: row.path,
    value: Number(row.views),
  }));

  const referrerData = referrers.map((row: { referrer: string; views: string | number }) => ({
    label: row.referrer.replace(/https?:\/\//, "").slice(0, 25),
    value: Number(row.views),
  }));

  return (
    <div className="min-h-screen bg-charcoal-900">
      <AdminHeader />

      <div className="px-6 md:px-8 py-8 max-w-7xl mx-auto space-y-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            label="Total Views (30d)"
            value={Number(totalStats.total_views).toLocaleString()}
          />
          <StatsCard
            label="Unique Visitors (30d)"
            value={Number(totalStats.total_visitors).toLocaleString()}
          />
          <StatsCard
            label="Today's Views"
            value={Number(todayStats.views).toLocaleString()}
            sub={`${todayStats.visitors} visitors`}
          />
          <StatsCard
            label="Form Submissions"
            value={Number(subCount.total).toLocaleString()}
            sub={`${subCount.unread} unread`}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-charcoal-800/50 rounded-2xl p-6 border border-charcoal-700">
            <h3 className="text-sm font-semibold text-white mb-4">
              Views (Last 14 Days)
            </h3>
            {chartData.length > 0 ? (
              <SimpleBarChart data={chartData} />
            ) : (
              <p className="text-charcoal-500 text-sm">No data yet</p>
            )}
          </div>
          <div className="bg-charcoal-800/50 rounded-2xl p-6 border border-charcoal-700">
            <h3 className="text-sm font-semibold text-white mb-4">
              Top Pages (30 Days)
            </h3>
            {pageData.length > 0 ? (
              <SimpleBarChart data={pageData} />
            ) : (
              <p className="text-charcoal-500 text-sm">No data yet</p>
            )}
          </div>
        </div>

        {/* Referrers */}
        {referrerData.length > 0 && (
          <div className="bg-charcoal-800/50 rounded-2xl p-6 border border-charcoal-700">
            <h3 className="text-sm font-semibold text-white mb-4">
              Traffic Sources (30 Days)
            </h3>
            <SimpleBarChart data={referrerData} />
          </div>
        )}

        {/* Submissions */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-4">
            Recent Submissions
            {Number(subCount.unread) > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-warm-600 text-white text-xs rounded-full">
                {subCount.unread} new
              </span>
            )}
          </h3>
          <SubmissionsTable submissions={submissions} />
        </div>
      </div>
    </div>
  );
}
```

**Step 6: Create submission read API route**

`app/api/admin/submissions/[id]/read/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/auth";
import { markSubmissionRead } from "@/lib/db/analytics";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await validateSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await markSubmissionRead(Number(id));
  return NextResponse.json({ ok: true });
}
```

**Step 7: Verify build**

Run: `npm run build`
Expected: Compiles successfully

**Step 8: Commit**

```bash
git add app/admin/ components/admin/ app/api/admin/submissions/
git commit -m "feat: add admin dashboard with analytics and submissions"
```

---

### Task 11: Environment Variables & Vercel Postgres Setup

**Files:**
- Create: `.env.example`

**Step 1: Create .env.example**

```
# Vercel Postgres (auto-set when you link a Vercel Postgres database)
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=

# Admin password hash (generate with: node -e "require('bcryptjs').hash('yourpassword', 12).then(h => console.log(h))")
ADMIN_PASSWORD_HASH=
```

**Step 2: Set up Vercel Postgres**

Run these commands:

```bash
# Create a Vercel Postgres database (interactive — will prompt for name)
vercel postgres create

# Link the database to the project (pulls env vars)
vercel env pull .env.local
```

**Step 3: Generate admin password hash**

```bash
node -e "require('bcryptjs').hash('YOUR_CHOSEN_PASSWORD', 12).then(h => console.log(h))"
```

Then set it in Vercel:

```bash
vercel env add ADMIN_PASSWORD_HASH
```

**Step 4: Initialize database tables**

After deploying, visit `/api/setup` once to create the tables. Or run locally:

```bash
npm run dev
# Visit http://localhost:3000/api/setup
```

**Step 5: Commit**

```bash
git add .env.example
git commit -m "feat: add env example and deployment docs"
```

---

### Task 12: Deploy and Verify

**Step 1: Deploy to Vercel**

```bash
vercel --prod
```

**Step 2: Initialize database**

Visit `https://your-domain.vercel.app/api/setup` — should return `{ "message": "Database tables created successfully" }`

**Step 3: Test the flow**

1. Visit the site — page views should be recorded
2. Submit a contact form — should be stored in database
3. Visit `/admin` — should redirect to `/admin/login`
4. Log in with your password
5. Dashboard should show page views and form submissions

**Step 4: Final commit with any fixes**

```bash
git add -A
git commit -m "chore: final adjustments for admin dashboard"
```

---

## Summary of Files

**New files:**
- `lib/db/schema.ts` — database table definitions
- `lib/db/seed.ts` — table creation runner
- `lib/db/analytics.ts` — all analytics queries
- `lib/auth.ts` — password verification, session management
- `app/api/setup/route.ts` — one-time DB setup
- `app/api/track/route.ts` — page view recording
- `app/api/contact/route.ts` — form submission storage
- `app/api/admin/login/route.ts` — login endpoint
- `app/api/admin/logout/route.ts` — logout endpoint
- `app/api/admin/check/route.ts` — session check
- `app/api/admin/submissions/[id]/read/route.ts` — mark submission read
- `app/admin/layout.tsx` — full-screen dark admin shell
- `app/admin/login/page.tsx` — login page
- `app/admin/page.tsx` — main dashboard
- `components/admin/AdminHeader.tsx` — admin nav bar
- `components/admin/StatsCard.tsx` — metric card
- `components/admin/SimpleBarChart.tsx` — horizontal bar chart
- `components/admin/SubmissionsTable.tsx` — expandable submissions list
- `components/PageViewTracker.tsx` — client-side tracker
- `middleware.ts` — route protection
- `.env.example` — environment variable template

**Modified files:**
- `app/layout.tsx` — add PageViewTracker
- `components/ContactForm.tsx` — wire to real API
- `package.json` — new dependencies
