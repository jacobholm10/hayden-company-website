import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function POST(request: NextRequest) {
  try {
    const { path, referrer, visitorId } = await request.json();
    if (!path) {
      return NextResponse.json({ error: "Path required" }, { status: 400 });
    }

    const userAgent = request.headers.get("user-agent") || "";
    if (/bot|crawler|spider|crawling/i.test(userAgent)) {
      return NextResponse.json({ ok: true });
    }

    const sql = getDb();
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
