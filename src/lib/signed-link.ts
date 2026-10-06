import { createHmac, timingSafeEqual } from "node:crypto";
import type { z } from "zod";

/**
 * Order links are signed, not stored: until there is a database, the link itself
 * carries the order and an HMAC (keyed with ORDER_SECRET) proves we made it.
 * The payload is readable by anyone holding the link, so keep secrets out of it.
 */

// Lets `npm run dev` work without setup. Production builds need a real secret.
const DEV_SECRET = "frostwell-dev-only-order-secret";

export function orderSecret(): string | null {
  const secret = process.env.ORDER_SECRET?.trim();
  if (secret) return secret;
  return process.env.NODE_ENV === "production" ? null : DEV_SECRET;
}

type Kind = "pending" | "confirmed";

const hmac = (secret: string, data: string) => createHmac("sha256", secret).update(data).digest("base64url");

/** `<payload>.<signature>`; the kind is signed too, so one kind can't stand in for another. */
export function signToken(kind: Kind, payload: unknown): string {
  const secret = orderSecret();
  if (!secret) throw new Error("ORDER_SECRET is not set.");
  const body = Buffer.from(JSON.stringify({ kind, payload })).toString("base64url");
  return `${body}.${hmac(secret, body)}`;
}

/**
 * The key in the bakery's link for one order: an HMAC of the order number, so it opens that
 * order's admin page and no other, and can't be worked out from the number without ORDER_SECRET.
 * The "admin-key:" prefix can't occur in a token body (base64url), so a key never doubles as a signature.
 */
export function adminKey(orderNumber: string): string {
  const secret = orderSecret();
  if (!secret) throw new Error("ORDER_SECRET is not set.");
  return hmac(secret, `admin-key:${orderNumber}`);
}

export function adminKeyMatches(orderNumber: string, key: unknown): boolean {
  if (!orderSecret() || typeof key !== "string") return false;
  const expected = Buffer.from(adminKey(orderNumber));
  const given = Buffer.from(key);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

/** The payload if the token is ours, of this kind and the right shape; otherwise null. */
export function verifyToken<T extends z.ZodType>(kind: Kind, token: unknown, schema: T): z.infer<T> | null {
  const secret = orderSecret();
  if (!secret || typeof token !== "string") return null;
  const [body, signature, extra] = token.split(".");
  if (!body || !signature || extra !== undefined) return null;
  const expected = Buffer.from(hmac(secret, body));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (data?.kind !== kind) return null;
    const parsed = schema.safeParse(data.payload);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
