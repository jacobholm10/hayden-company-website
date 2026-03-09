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
