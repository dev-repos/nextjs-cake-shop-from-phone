"use server";

import { confirmedOrderSchema } from "@/lib/order";
import { logPaypalInvoice } from "@/lib/payments";
import { verifyToken } from "@/lib/signed-link";

export type PaypalState = { sent?: boolean; error?: string };

export async function requestPaypalInvoice(token: string): Promise<PaypalState> {
  const order = verifyToken("confirmed", token, confirmedOrderSchema);
  if (!order) return { error: "This payment link isn't valid." };
  logPaypalInvoice(order);
  return { sent: true };
}
