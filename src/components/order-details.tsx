"use client";

import { ButtonLink } from "@/components/button-link";
import { OrderSummary } from "@/components/order-items";
import { useOrder } from "@/lib/cart";
import { formatDate } from "@/lib/order";

const nextSteps = [
  {
    title: "We confirm your cake",
    body: "Our baker checks every detail and gets in touch if anything needs a tweak.",
  },
  {
    title: "You get an invoice by email and text",
    body: "Once confirmed, the invoice goes to the email and phone number you gave us.",
  },
  {
    title: "You pay by UPI or PayPal",
    body: "Pay from the invoice. We never ask for card details on this site.",
  },
];

export function OrderDetails({ number }: { number: string }) {
  const order = useOrder(number);

  if (order === undefined) return <p className="text-cocoa-500">Loading your order…</p>;
  if (order === null) {
    return (
      <div className="rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-cocoa-900/5">
        <h1 className="font-display text-2xl font-semibold text-cocoa-900">Order not found</h1>
        <p className="mt-2 text-cocoa-700">
          Orders are saved on the device you placed them from. Try opening this link there.
        </p>
        <ButtonLink href="/cakes" className="mt-4">
          Browse cakes
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-raspberry-700">Order request sent</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-cocoa-900 sm:text-4xl">
          Thank you, {order.customer.name.split(" ")[0]}!
        </h1>
        <dl className="mt-4 grid grid-cols-2 gap-3">
          <div className="col-span-2 rounded-2xl bg-white p-4 ring-1 ring-cocoa-900/5">
            <dt className="text-xs text-cocoa-500">Order number</dt>
            <dd className="font-display text-2xl font-semibold tabular-nums text-cocoa-900">{order.number}</dd>
          </div>
          <div className="rounded-2xl bg-white p-4 ring-1 ring-cocoa-900/5">
            <dt className="text-xs text-cocoa-500">Status</dt>
            <dd className="flex items-center gap-1.5 font-semibold text-cocoa-900">
              <span aria-hidden className="size-2 rounded-full bg-amber-500" />
              Awaiting confirmation
            </dd>
          </div>
          <div className="rounded-2xl bg-white p-4 ring-1 ring-cocoa-900/5">
            <dt className="text-xs text-cocoa-500">Pickup</dt>
            <dd className="font-semibold text-cocoa-900">{formatDate(order.customer.pickupDate)}</dd>
          </div>
        </dl>
      </div>

      <section>
        <h2 className="font-display text-xl font-semibold text-cocoa-900">Summary</h2>
        <div className="mt-3">
          <OrderSummary items={order.items} total={order.total} />
        </div>
        {order.customer.notes && (
          <p className="mt-3 text-sm text-cocoa-700">
            <span className="font-semibold">Notes:</span> {order.customer.notes}
          </p>
        )}
        <p className="mt-3 text-sm text-cocoa-500">
          Invoice to {order.invoiceTo.email} and {order.invoiceTo.phone}
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-cocoa-900">What happens next</h2>
        <ol className="mt-3 space-y-3">
          {nextSteps.map((step, i) => (
            <li key={step.title} className="flex gap-4 rounded-2xl bg-white p-4 ring-1 ring-cocoa-900/5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-raspberry-600 font-semibold text-white">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-cocoa-900">{step.title}</p>
                <p className="text-sm text-cocoa-700">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <ButtonLink href="/cakes" variant="secondary" className="w-full">
        Keep browsing
      </ButtonLink>
    </div>
  );
}
