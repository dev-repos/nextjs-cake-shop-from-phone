import { randomBytes } from "node:crypto";
import { z } from "zod";
import { mask, orderRequestSchema, orderTotal, priceItem, type Order } from "@/lib/order";
import { orderSecret, signToken } from "@/lib/signed-link";

// No 0/O or 1/I, so the number is easy to read out over the phone.
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

function orderNumber(today: string) {
  const suffix = Array.from(randomBytes(5), (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `FW-${today.slice(2).replaceAll("-", "")}-${suffix}`;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Send the order as JSON." }, { status: 400 });
  }

  const parsed = orderRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Please check the highlighted fields.", fields: z.flattenError(parsed.error).fieldErrors },
      { status: 422 },
    );
  }

  const { items, name, phone, email, pickupDate, notes } = parsed.data;
  const priced = items.map(priceItem);
  if (priced.some((item) => item === null)) {
    return Response.json(
      { error: "Some cakes in your cart are no longer available. Please review your cart." },
      { status: 422 },
    );
  }
  const pricedItems = priced.filter((item) => item !== null);

  const createdAt = new Date();
  const order: Order = {
    number: orderNumber(createdAt.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })),
    createdAt: createdAt.toISOString(),
    status: "awaiting-confirmation",
    customer: { name, pickupDate, notes },
    invoiceTo: { email, phone },
    items: pricedItems,
    total: orderTotal(pricedItems),
  };

  // No payment and no messages yet: the baker confirms the cake first, then the invoice goes out.
  console.info(
    `[orders] ${order.number}: order request received (${pricedItems.length} item(s), ₹${order.total}, pickup ${pickupDate}). ` +
      `Invoice will be sent to ${mask(email)} and ${mask(phone)} after confirmation — nothing sent now.`,
  );
  // Stands in for the "new order" alert to the bakery: the signed link carries the order to the admin page.
  if (orderSecret()) {
    const adminLink = new URL(`/admin/orders/${order.number}`, request.url);
    adminLink.searchParams.set("order", signToken("pending", order));
    console.info(`[orders] ${order.number}: review and confirm at ${adminLink}`);
  } else {
    console.warn(`[orders] ${order.number}: ORDER_SECRET is not set, so there is no admin link to confirm this order.`);
  }

  return Response.json(order, { status: 201 });
}
