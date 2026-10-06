"use server";

import { cookies, headers } from "next/headers";
import { ADMIN_COOKIE, isAdmin, sessionValue, tokenMatches } from "@/lib/admin-auth";
import { logInvoice } from "@/lib/invoice";
import { orderSchema, type ConfirmedOrder } from "@/lib/order";
import { signToken, verifyToken } from "@/lib/signed-link";

export type SignInState = { error?: string };

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  if (!tokenMatches(String(formData.get("token") ?? ""))) return { error: "That admin token isn't right." };
  (await cookies()).set(ADMIN_COOKIE, sessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: 8 * 60 * 60,
  });
  // Setting the cookie re-renders the page, which now shows the order.
  return {};
}

export type ConfirmState = { link?: string; error?: string };

async function siteOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/** Server Actions are public endpoints, so this re-checks the admin cookie and the order signature. */
export async function confirmOrder(pendingToken: string): Promise<ConfirmState> {
  if (!(await isAdmin())) return { error: "Sign in again to confirm orders." };
  const order = verifyToken("pending", pendingToken, orderSchema);
  if (!order) return { error: "This order link isn't valid." };

  const confirmed: ConfirmedOrder = {
    number: order.number,
    createdAt: order.createdAt,
    confirmedAt: new Date().toISOString(),
    customer: order.customer,
    email: order.invoiceTo.email,
    items: order.items,
    total: order.total,
  };
  const link = new URL(`/orders/${order.number}`, await siteOrigin());
  link.searchParams.set("t", signToken("confirmed", confirmed));

  logInvoice(order, link.toString());
  return { link: link.toString() };
}
