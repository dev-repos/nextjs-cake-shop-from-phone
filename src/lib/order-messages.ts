import { inr } from "./content";
import { adminEmail, sendEmail, type Delivery } from "./email";
import { formatDate, mask, type Order, type PricedItem } from "./order";
import { BUSINESS_NAME } from "./payments";

const itemLines = (items: PricedItem[]) =>
  items.map(
    (item) =>
      `- ${item.quantity} × ${item.name}, ${item.sizeInches}" · ${item.flavour} · ${item.frosting}` +
      `${item.message ? ` · "${item.message}"` : ""}: ${inr(item.lineTotal)}`,
  );

/** The new-order email to the bakery. `link` opens this order's admin page with its own key. */
export async function emailNewOrder(order: Order, link: string): Promise<Delivery> {
  const to = adminEmail();
  const email = {
    to: to ?? "",
    subject: `New order ${order.number}: ${inr(order.total)}, pickup ${formatDate(order.customer.pickupDate)}`,
    text: [
      `${order.customer.name} sent an order request.`,
      "",
      `Pickup: ${formatDate(order.customer.pickupDate)}`,
      ...itemLines(order.items),
      `Total: ${inr(order.total)}`,
      ...(order.customer.notes ? ["", `Notes: ${order.customer.notes}`] : []),
      "",
      `Review and accept it here: ${link}`,
      "",
      "This link carries the key for this order only. Don't forward it: anyone with it can accept the order.",
    ].join("\n"),
  };
  return sendEmail(`${order.number} new order`, email, to ?? "(ADMIN_EMAIL not set)");
}

/** Emails the customer their confirmed-order link and logs the text message (there is no SMS provider). */
export async function sendInvoice(order: Order, link: string): Promise<Delivery> {
  const firstName = order.customer.name.split(" ")[0];
  const pickup = formatDate(order.customer.pickupDate);
  const text = `${BUSINESS_NAME}: order ${order.number} confirmed, pickup ${pickup}. Pay ${inr(order.total)}: ${link}`;
  console.info(`[text] ${order.number}: logged, not sent (no SMS provider).\n  To ${mask(order.invoiceTo.phone)}: ${text}`);

  const email = {
    to: order.invoiceTo.email,
    subject: `${BUSINESS_NAME} invoice ${order.number}: ${inr(order.total)}`,
    text: [
      `Hi ${firstName}, your cake is confirmed for pickup on ${pickup}.`,
      "",
      ...itemLines(order.items),
      `Total: ${inr(order.total)}`,
      "",
      `View your order and pay by UPI or PayPal here: ${link}`,
      "",
      `Thank you for ordering from ${BUSINESS_NAME}!`,
    ].join("\n"),
  };
  return sendEmail(`${order.number} invoice`, email, mask(order.invoiceTo.email));
}
