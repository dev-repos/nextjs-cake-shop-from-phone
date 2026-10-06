"use server";

import { headers } from "next/headers";
import type { Delivery } from "@/lib/email";
import { orderSchema, type ConfirmedOrder } from "@/lib/order";
import { sendInvoice } from "@/lib/order-messages";
import { adminKeyMatches, signToken, verifyToken } from "@/lib/signed-link";

export type ConfirmState = { link?: string; email?: Delivery | "failed"; error?: string };

async function siteOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/** Server Actions are public endpoints, so this re-checks the order signature and the order's own key. */
export async function confirmOrder(pendingToken: string, key: string): Promise<ConfirmState> {
  const order = verifyToken("pending", pendingToken, orderSchema);
  if (!order || !adminKeyMatches(order.number, key)) return { error: "This order link isn't valid." };

  const confirmed: ConfirmedOrder = {
    number: order.number,
    createdAt: order.createdAt,
    confirmedAt: new Date().toISOString(),
    customer: order.customer,
    email: order.invoiceTo.email,
    items: order.items,
    total: order.total,
  };
  // The customer's own token: it shows the confirmed order and its Pay section, and can't open the admin page.
  const link = new URL(`/orders/${order.number}`, await siteOrigin());
  link.searchParams.set("t", signToken("confirmed", confirmed));

  try {
    return { link: link.toString(), email: await sendInvoice(order, link.toString()) };
  } catch (error) {
    console.error(`[orders] ${order.number}: couldn't email the invoice (${error}).`);
    return { link: link.toString(), email: "failed" };
  }
}
