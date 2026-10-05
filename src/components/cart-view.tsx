"use client";

import { ButtonLink } from "@/components/button-link";
import { ItemDetails } from "@/components/order-items";
import { removeFromCart, setQuantity, useCart } from "@/lib/cart";
import { inr } from "@/lib/content";
import { MAX_QUANTITY, orderTotal, priceItem } from "@/lib/order";

export function CartView() {
  const cart = useCart();
  if (cart === null) return <p className="mt-6 text-cocoa-500">Loading your cart…</p>;

  // Priced from the catalogue so a stale saved price can't sneak through.
  const items = cart.map((item, index) => ({ index, priced: priceItem(item) }));
  const available = items.flatMap(({ priced }) => (priced ? [priced] : []));

  if (cart.length === 0) {
    return (
      <div className="mt-6 rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-cocoa-900/5">
        <p className="text-cocoa-700">Your cart is empty.</p>
        <ButtonLink href="/cakes" className="mt-4">
          Browse cakes
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      <ul className="space-y-3">
        {items.map(({ index, priced }) => (
          <li key={index} className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-cocoa-900/5">
            {priced ? (
              <>
                <div className="flex justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-cocoa-900">{priced.name}</p>
                    <ItemDetails item={priced} />
                    <p className="mt-1 text-sm text-cocoa-500">{inr(priced.unitPrice)} each</p>
                  </div>
                  <p className="shrink-0 font-semibold tabular-nums text-cocoa-900">{inr(priced.lineTotal)}</p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <QuantityStepper
                    label={priced.name}
                    value={priced.quantity}
                    onChange={(q) => setQuantity(index, q)}
                  />
                  <button
                    type="button"
                    onClick={() => removeFromCart(index)}
                    className="min-h-11 rounded-full px-3 text-sm font-medium text-cocoa-700 hover:text-raspberry-700"
                  >
                    Remove
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-cocoa-700">This cake is no longer available.</p>
                <button
                  type="button"
                  onClick={() => removeFromCart(index)}
                  className="min-h-11 rounded-full px-3 text-sm font-medium text-raspberry-700"
                >
                  Remove
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-cocoa-900/5">
        <div className="flex items-baseline justify-between">
          <p className="font-semibold text-cocoa-900">Total</p>
          <p aria-live="polite" className="font-display text-2xl font-semibold tabular-nums text-cocoa-900">
            {inr(orderTotal(available))}
          </p>
        </div>
        <p className="mt-1 text-sm text-cocoa-500">No payment now. We confirm your cake before invoicing.</p>
        {available.length > 0 && (
          <ButtonLink href="/checkout" className="mt-4 w-full">
            Request order
          </ButtonLink>
        )}
      </div>
    </div>
  );
}

function QuantityStepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const button =
    "flex size-11 items-center justify-center rounded-full text-xl text-cocoa-900 hover:bg-cream-100 disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-raspberry-600";
  return (
    <div role="group" aria-label={`Quantity of ${label}`} className="flex items-center rounded-full ring-1 ring-cocoa-900/15">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
        className={button}
      >
        −
      </button>
      <span aria-live="polite" className="w-8 text-center font-semibold tabular-nums">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= MAX_QUANTITY}
        onClick={() => onChange(value + 1)}
        className={button}
      >
        +
      </button>
    </div>
  );
}
