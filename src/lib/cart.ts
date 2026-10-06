"use client";

import { useSyncExternalStore } from "react";
import { z } from "zod";
import { cartItemSchema, MAX_QUANTITY, type CartItem, type Order } from "./order";

const CART_KEY = "frostwell-cart";
const ORDERS_KEY = "frostwell-orders";
const CHANGE_EVENT = "frostwell-storage";

// Storage can be missing or throw (private mode, blocked cookies); the site still works for the visit.
function read(key: string): unknown {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null");
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  // "storage" keeps other tabs in sync; our own event covers this tab.
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/** useSyncExternalStore needs a stable snapshot, so cache by the raw string. */
function cachedReader<T>(key: string, parse: (raw: unknown) => T) {
  let lastRaw: string | null | undefined;
  let last: T;
  return () => {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(key);
    } catch {}
    if (raw !== lastRaw) {
      lastRaw = raw;
      last = parse(read(key));
    }
    return last;
  };
}

/** Drops anything that doesn't fit today's cart shape, e.g. carts saved by an older version. */
const parseCart = (raw: unknown): CartItem[] =>
  Array.isArray(raw)
    ? raw.flatMap((item) => {
        const parsed = cartItemSchema.safeParse(item);
        return parsed.success ? [parsed.data] : [];
      })
    : [];

const getCart = cachedReader(CART_KEY, parseCart);
const EMPTY: CartItem[] = [];

/** The saved cart, or null before hydration (the server can't see the device's storage). */
export function useCart(): CartItem[] | null {
  return useSyncExternalStore(subscribe, getCart, () => null);
}

export function useCartCount() {
  return (useCart() ?? EMPTY).reduce((n, item) => n + item.quantity, 0);
}

const sameItem = (a: CartItem, b: CartItem) =>
  a.cake === b.cake &&
  a.sizeInches === b.sizeInches &&
  a.flavourId === b.flavourId &&
  a.frostingId === b.frostingId &&
  a.message === b.message;

/** Adds one of `item`, or bumps the quantity if the same cake is already in the cart. */
export function addToCart(item: Omit<CartItem, "quantity">) {
  const cart = getCart();
  const match = cart.findIndex((c) => sameItem(c, { ...item, quantity: 1 }));
  write(
    CART_KEY,
    match === -1
      ? [...cart, { ...item, quantity: 1 }]
      : cart.map((c, i) => (i === match ? { ...c, quantity: Math.min(MAX_QUANTITY, c.quantity + 1) } : c)),
  );
}

export function setQuantity(index: number, quantity: number) {
  const q = Math.max(1, Math.min(MAX_QUANTITY, Math.round(quantity)));
  write(CART_KEY, getCart().map((c, i) => (i === index ? { ...c, quantity: q } : c)));
}

export function removeFromCart(index: number) {
  write(CART_KEY, getCart().filter((_, i) => i !== index));
}

export function clearCart() {
  write(CART_KEY, []);
}

const ordersSchema = z.record(z.string(), z.custom<Order>((o) => typeof o === "object" && o !== null));
const getOrders = cachedReader(ORDERS_KEY, (raw) => {
  const parsed = ordersSchema.safeParse(raw);
  return parsed.success ? parsed.data : {};
});

/** Orders live on this device until there's a database. */
export function saveOrder(order: Order) {
  write(ORDERS_KEY, { ...getOrders(), [order.number]: order });
}

/** undefined before hydration, null when this device has no such order. */
export function useOrder(number: string): Order | null | undefined {
  const orders = useSyncExternalStore(subscribe, getOrders, () => undefined);
  return orders === undefined ? undefined : (orders[number] ?? null);
}
