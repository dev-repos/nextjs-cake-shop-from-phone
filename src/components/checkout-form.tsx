"use client";

import { useRouter } from "next/navigation";
import { useId, useState, useSyncExternalStore, type ComponentProps } from "react";
import { z } from "zod";
import { ButtonLink } from "@/components/button-link";
import { OrderSummary } from "@/components/order-items";
import { clearCart, saveOrder, useCart } from "@/lib/cart";
import { PICKUP_LEAD_DAYS } from "@/lib/cakes";
import {
  customerSchema,
  earliestPickupDate,
  formatDate,
  NOTES_MAX_LENGTH,
  orderTotal,
  priceItem,
  type CustomerFields,
  type Order,
} from "@/lib/order";

type Errors = Partial<Record<CustomerFields, string>>;

// "Today" only exists in the browser; the static HTML renders without a minimum date.
const noSubscribe = () => () => {};
const useEarliestPickup = () => useSyncExternalStore(noSubscribe, earliestPickupDate, () => "");

const firstErrors = (fields: Partial<Record<string, string[]>>): Errors =>
  Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v?.[0]]));

export function CheckoutForm() {
  const router = useRouter();
  const cart = useCart();
  const minDate = useEarliestPickup();
  const ids = useId();
  const [values, setValues] = useState({ name: "", phone: "", email: "", pickupDate: "", notes: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "placed">("idle");

  if (status === "placed") return <p className="mt-6 text-cocoa-700">Order requested. Opening your order…</p>;
  if (cart === null) return <p className="mt-6 text-cocoa-500">Loading your cart…</p>;

  const items = cart.flatMap((item) => {
    const priced = priceItem(item);
    return priced ? [priced] : [];
  });

  if (items.length === 0) {
    return (
      <div className="mt-6 rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-cocoa-900/5">
        <p className="text-cocoa-700">Your cart is empty.</p>
        <ButtonLink href="/cakes" className="mt-4">
          Browse cakes
        </ButtonLink>
      </div>
    );
  }

  const set = (field: CustomerFields) => (value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  async function submit() {
    setFormError("");
    const check = customerSchema.safeParse(values);
    if (!check.success) {
      const found = firstErrors(z.flattenError(check.error).fieldErrors);
      setErrors(found);
      document.getElementById(`${ids}-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, items: cart }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(firstErrors(data.fields ?? {}));
        setFormError(data.error ?? "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }
      const order = data as Order;
      saveOrder(order);
      setStatus("placed");
      clearCart();
      router.push(`/orders/${order.number}`);
    } catch {
      setFormError("We couldn't reach the bakery. Check your connection and try again.");
      setStatus("idle");
    }
  }

  const field = (name: CustomerFields) => ({
    id: `${ids}-${name}`,
    value: values[name],
    error: errors[name],
    onChange: set(name),
  });

  return (
    <div className="mt-6 space-y-8">
      <OrderSummary items={items} total={orderTotal(items)} />

      <form
        noValidate
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (status === "idle") submit();
        }}
      >
        <Field label="Name" autoComplete="name" {...field("name")} />
        <Field label="Phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="98765 43210" {...field("phone")} />
        <Field label="Email" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" {...field("email")} />
        <Field
          label="Pickup date"
          type="date"
          min={minDate || undefined}
          hint={
            minDate
              ? `We need ${PICKUP_LEAD_DAYS} days. Earliest pickup: ${formatDate(minDate)}.`
              : `We need at least ${PICKUP_LEAD_DAYS} days to bake.`
          }
          {...field("pickupDate")}
        />
        <Field
          label="Notes"
          optional
          multiline
          maxLength={NOTES_MAX_LENGTH}
          placeholder="Allergies, colours, pickup time…"
          {...field("notes")}
        />

        <div className="rounded-3xl bg-raspberry-100/50 p-5 ring-1 ring-raspberry-600/20">
          <p className="font-semibold text-cocoa-900">No payment now</p>
          <p className="mt-1 text-sm text-cocoa-700">
            No payment now — after we confirm your cake, we&apos;ll send an invoice to your email and phone.
          </p>
        </div>

        <p role="alert" className="text-sm font-medium text-raspberry-700 empty:hidden">
          {formError}
        </p>

        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-raspberry-600 px-6 text-base font-semibold text-white shadow-sm transition-colors hover:bg-raspberry-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-raspberry-600 disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send order request"}
        </button>
      </form>
    </div>
  );
}

type FieldProps = {
  id: string;
  label: string;
  value: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  multiline?: boolean;
  onChange: (value: string) => void;
} & Omit<ComponentProps<"input"> & ComponentProps<"textarea">, "id" | "value" | "onChange">;

function Field({ id, label, value, error, hint, optional, multiline, onChange, ...rest }: FieldProps) {
  const className =
    "mt-2 block min-h-12 w-full rounded-2xl bg-white px-4 text-base text-cocoa-900 ring-1 ring-cocoa-900/15 placeholder:text-cocoa-500/60 focus:outline-2 focus:outline-raspberry-600 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-raspberry-600";
  const shared = {
    id,
    value,
    "aria-invalid": !!error,
    "aria-describedby": `${id}-hint ${id}-error`,
  };
  return (
    <div>
      <label htmlFor={id} className="font-semibold text-cocoa-900">
        {label} {optional && <span className="font-normal text-cocoa-500">(optional)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-cocoa-500">
          {hint}
        </p>
      )}
      {multiline ? (
        <textarea {...rest} {...shared} rows={3} onChange={(e) => onChange(e.target.value)} className={`${className} py-3`} />
      ) : (
        <input {...rest} {...shared} onChange={(e) => onChange(e.target.value)} className={className} />
      )}
      <p id={`${id}-error`} className="mt-2 text-sm font-medium text-raspberry-700 empty:hidden">
        {error}
      </p>
    </div>
  );
}
