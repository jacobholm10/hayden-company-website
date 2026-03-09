import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, email, phone, service, date, message, items, supplies } = data;

    if (!name || !email || !phone || !service || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const sql = getDb();
    await sql`
      INSERT INTO form_submissions (name, email, phone, service, preferred_date, message, items, supplies)
      VALUES (${name}, ${email}, ${phone}, ${service}, ${date || null}, ${message}, ${items || null}, ${supplies || null})
    `;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
