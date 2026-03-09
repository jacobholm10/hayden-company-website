import { cookies } from "next/headers";
import { getDb } from "./db/index";
import bcrypt from "bcryptjs";

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

export async function verifyPassword(password: string): Promise<boolean> {
  const adminHash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminHash) return false;
  return bcrypt.compare(password, adminHash);
}

export async function createSession(): Promise<string> {
  const sql = getDb();
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();

  await sql`
    INSERT INTO admin_sessions (token, expires_at)
    VALUES (${token}, ${expiresAt})
  `;

  return token;
}

export async function validateSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) return false;

  const sql = getDb();
  const result = await sql`
    SELECT id FROM admin_sessions
    WHERE token = ${token} AND expires_at > NOW()
    LIMIT 1
  `;

  return result.length > 0;
}

export async function deleteSession(token: string) {
  const sql = getDb();
  await sql`DELETE FROM admin_sessions WHERE token = ${token}`;
}
