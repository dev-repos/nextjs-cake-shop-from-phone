import { inr } from "./content";
import { formatDate, mask, type Order } from "./order";
import { BUSINESS_NAME } from "./payments";

/** What the invoice email and text would say. Logged instead of sent: this demo has no mail or SMS provider. */
export function logInvoice(order: Order, link: string) {
  const firstName = order.customer.name.split(" ")[0];
  const pickup = formatDate(order.customer.pickupDate);
  const email = [
    `Subject: ${BUSINESS_NAME} invoice ${order.number}: ${inr(order.total)}`,
    `Hi ${firstName}, your cake is confirmed for pickup on ${pickup}.`,
    `Total: ${inr(order.total)}. Pay by UPI or PayPal here: ${link}`,
  ].join("\n    ");
  const text = `${BUSINESS_NAME}: order ${order.number} confirmed, pickup ${pickup}. Pay ${inr(order.total)}: ${link}`;
  console.info(
    `[invoice] ${order.number}: logged, not sent.\n` +
      `  Email to ${mask(order.invoiceTo.email)}:\n    ${email}\n` +
      `  Text to ${mask(order.invoiceTo.phone)}:\n    ${text}`,
  );
}
