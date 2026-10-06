import { mask, type ConfirmedOrder } from "./order";

/** Demo shop: nothing here moves money. UPI goes to a fake ID by default and PayPal is never called. */

export const BUSINESS_NAME = "Frostwell Cakes";

/** `.invalid` is a reserved domain, so no UPI app can resolve this ID to a real account. */
export const DEMO_UPI_VPA = "demo.only@invalid";

const VPA_PATTERN = /^[a-z0-9._-]{2,256}@[a-z0-9.-]{2,64}$/i;

export function upiVpa(): string {
  const vpa = process.env.UPI_VPA?.trim();
  if (!vpa) return DEMO_UPI_VPA;
  if (VPA_PATTERN.test(vpa)) return vpa;
  console.warn(`[payments] UPI_VPA "${vpa}" doesn't look like a UPI ID; using ${DEMO_UPI_VPA}.`);
  return DEMO_UPI_VPA;
}

/**
 * The standard UPI deep link (NPCI "upi://pay"). On a phone it opens a picker of
 * installed UPI apps such as GPay, PhonePe and Paytm; as a QR code, any UPI app can scan it.
 */
export function upiPayLink(order: Pick<ConfirmedOrder, "number" | "total">, vpa = upiVpa()) {
  // `pa` stays unescaped: some UPI apps reject "%40" in place of "@". VPA_PATTERN keeps it URL-safe.
  return [
    `upi://pay?pa=${vpa}`,
    `pn=${encodeURIComponent(BUSINESS_NAME)}`,
    `am=${order.total.toFixed(2)}`,
    "cu=INR",
    `tn=${encodeURIComponent(order.number)}`,
  ].join("&");
}

const PAYPAL_API = "https://api-m.sandbox.paypal.com";

const money = (value: number) => ({ currency_code: "INR", value: value.toFixed(2) });

/** The body for POST /v2/invoicing/invoices (PayPal Invoicing API v2). */
export function paypalInvoiceDraft(order: ConfirmedOrder) {
  const [given, ...rest] = order.customer.name.split(" ");
  return {
    detail: {
      invoice_number: order.number,
      // A real PayPal account must invoice in a currency it supports; INR keeps the demo's numbers as shown.
      currency_code: "INR",
      note: `Pickup on ${order.customer.pickupDate}. Thank you for ordering from ${BUSINESS_NAME}!`,
      payment_term: { term_type: "DUE_ON_RECEIPT" },
    },
    invoicer: { business_name: BUSINESS_NAME },
    primary_recipients: [
      { billing_info: { name: { given_name: given, surname: rest.join(" ") || undefined }, email_address: order.email } },
    ],
    items: order.items.map((item) => ({
      name: item.name,
      description: `${item.sizeInches}" · ${item.flavour} · ${item.frosting}${item.message ? ` · "${item.message}"` : ""}`,
      quantity: String(item.quantity),
      unit_amount: money(item.unitPrice),
    })),
    amount: { breakdown: { item_total: money(order.total) } },
  };
}

/**
 * Stub for the PayPal invoice flow. A real version would get an OAuth token with
 * PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET, create the invoice, then send it.
 * This one only logs those requests and never contacts PayPal.
 */
export function logPaypalInvoice(order: ConfirmedOrder) {
  const configured = Boolean(process.env.PAYPAL_CLIENT_ID?.trim() && process.env.PAYPAL_CLIENT_SECRET?.trim());
  const draft = paypalInvoiceDraft(order);
  const logged = {
    ...draft,
    primary_recipients: [{ billing_info: { ...draft.primary_recipients[0].billing_info, email_address: mask(order.email) } }],
  };
  console.info(
    `[paypal] ${order.number}: demo stub, PayPal not called. ` +
      (configured ? "PAYPAL_CLIENT_ID/SECRET are set but unused." : "PAYPAL_CLIENT_ID/SECRET not set.") +
      `\n  1. POST ${PAYPAL_API}/v1/oauth2/token (basic auth: client id + secret, grant_type=client_credentials)` +
      `\n  2. POST ${PAYPAL_API}/v2/invoicing/invoices\n${JSON.stringify(logged, null, 2)}` +
      `\n  3. POST ${PAYPAL_API}/v2/invoicing/invoices/{id}/send {"send_to_recipient":true}`,
  );
}
