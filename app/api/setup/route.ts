import { NextRequest, NextResponse } from "next/server";
import { seedDatabase } from "@/lib/db/seed";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (!process.env.SETUP_SECRET || secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
