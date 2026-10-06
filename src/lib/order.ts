import { z } from "zod";
import { getCake, MESSAGE_MAX_LENGTH, PICKUP_LEAD_DAYS } from "./cakes";

export const NOTES_MAX_LENGTH = 500;
export const MAX_QUANTITY = 10;

/** One line in the cart: a configured cake and how many of it. */
export const cartItemSchema = z.object({
  cake: z.string().min(1),
  sizeInches: z.union([z.literal(6), z.literal(8), z.literal(10)]),
  flavourId: z.string().min(1),
  frostingId: z.string().min(1),
  message: z.string().trim().max(MESSAGE_MAX_LENGTH),
  quantity: z.number().int().min(1).max(MAX_QUANTITY),
});

export type CartItem = z.infer<typeof cartItemSchema>;

/** A cart item with names and prices looked up from the catalogue. */
export const pricedItemSchema = cartItemSchema.extend({
  name: z.string(),
  flavour: z.string(),
  frosting: z.string(),
  unitPrice: z.number(),
  lineTotal: z.number(),
});

export type PricedItem = z.infer<typeof pricedItemSchema>;

/**
 * Prices an item from the catalogue, never from what the browser sent.
 * Returns null when the cake or one of its options no longer exists.
 */
export function priceItem(item: CartItem): PricedItem | null {
  const cake = getCake(item.cake);
  const size = cake?.sizes.find((s) => s.inches === item.sizeInches);
  const flavour = cake?.flavours.find((f) => f.id === item.flavourId);
  const frosting = cake?.frostings.find((f) => f.id === item.frostingId);
  if (!cake || !size || !flavour || !frosting) return null;
  const unitPrice = size.price + flavour.extra + frosting.extra;
  return {
    ...item,
    name: cake.name,
    flavour: flavour.name,
    frosting: frosting.name,
    unitPrice,
    lineTotal: unitPrice * item.quantity,
  };
}

export const orderTotal = (items: PricedItem[]) =>
  items.reduce((sum, item) => sum + item.lineTotal, 0);

/** Today's date in India (YYYY-MM-DD) plus `days`. */
export function indiaDate(days = 0) {
  const d = new Date(Date.now() + days * 86_400_000);
  return d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

export const earliestPickupDate = () => indiaDate(PICKUP_LEAD_DAYS);

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/** Accepts an Indian mobile (with or without +91) or any +country number. */
const phoneSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s()-]/g, ""))
  .transform((v) => (/^(?:\+?91|0)?[6-9]\d{9}$/.test(v) ? `+91${v.slice(-10)}` : v))
  .refine((v) => /^\+[1-9]\d{6,14}$/.test(v), "Enter a valid mobile number.");

export const customerSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80, "Keep your name under 80 characters."),
  phone: phoneSchema,
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address.")),
  pickupDate: z.iso
    .date("Choose a pickup date.")
    .refine((d) => d >= earliestPickupDate(), {
      message: `Pickup must be at least ${PICKUP_LEAD_DAYS} days from today.`,
    }),
  notes: z
    .string()
    .trim()
    .max(NOTES_MAX_LENGTH, `Keep notes under ${NOTES_MAX_LENGTH} characters.`)
    .default(""),
});

export type CustomerFields = keyof z.input<typeof customerSchema>;

export const orderRequestSchema = customerSchema.extend({
  items: z.array(cartItemSchema).min(1, "Your cart is empty.").max(20),
});

export type OrderRequest = z.input<typeof orderRequestSchema>;

/** What /api/orders returns and the browser keeps until there is a database. */
export const orderSchema = z.object({
  number: z.string(),
  createdAt: z.string(),
  status: z.literal(["awaiting-confirmation", "confirmed"]),
  customer: z.object({ name: z.string(), pickupDate: z.string(), notes: z.string() }),
  /** Where the invoice goes once we confirm the cake. */
  invoiceTo: z.object({ email: z.string(), phone: z.string() }),
  items: z.array(pricedItemSchema),
  total: z.number(),
});

export type Order = z.infer<typeof orderSchema>;
export type OrderStatus = Order["status"];

/**
 * What the customer's confirmed-order link carries. Leaves out the phone number;
 * keeps the email because a PayPal invoice is addressed to it.
 */
export const confirmedOrderSchema = orderSchema
  .omit({ status: true, invoiceTo: true })
  .extend({ confirmedAt: z.string(), email: z.string() });

export type ConfirmedOrder = z.infer<typeof confirmedOrderSchema>;

/** Shortens an email or phone for logs, e.g. "ra…om". */
export const mask = (value: string) => `${value.slice(0, 2)}…${value.slice(-2)}`;
