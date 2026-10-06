import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/** Demo-only bakery login: one shared ADMIN_TOKEN, remembered in an httpOnly cookie. */

export const ADMIN_COOKIE = "frostwell-admin";

const adminToken = () => process.env.ADMIN_TOKEN?.trim() || null;
const digest = (value: string) => createHash("sha256").update(value).digest();

export const adminEnabled = () => adminToken() !== null;

/** Compares digests so the check takes the same time whatever was typed. */
export function tokenMatches(candidate: string): boolean {
  const token = adminToken();
  return token !== null && timingSafeEqual(digest(candidate), digest(token));
}

/** The cookie holds a hash of the token, never the token itself. */
export const sessionValue = () => digest(adminToken() ?? "").toString("hex");

export async function isAdmin(): Promise<boolean> {
  const token = adminToken();
  const value = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token || !value || !/^[0-9a-f]{64}$/.test(value)) return false;
  return timingSafeEqual(Buffer.from(value, "hex"), digest(token));
}
