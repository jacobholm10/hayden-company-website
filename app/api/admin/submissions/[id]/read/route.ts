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
