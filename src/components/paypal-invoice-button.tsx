"use client";

import { useActionState } from "react";
import { requestPaypalInvoice, type PaypalState } from "@/app/orders/[number]/actions";
import { buttonClassName } from "./button-link";

export function PaypalInvoiceButton({ token, email }: { token: string; email: string }) {
  const [state, action, pending] = useActionState(requestPaypalInvoice.bind(null, token), {} as PaypalState);

  if (state.sent) {
    return (
      <p role="status" className="rounded-2xl bg-cream-100 p-4 text-cocoa-700">
        Demo: we logged the PayPal invoice we would send to {email}. Nothing was sent and PayPal wasn&apos;t contacted.
      </p>
    );
  }

  return (
    <form action={action} className="space-y-3">
      <p role="alert" className="font-medium text-raspberry-700 empty:hidden">
        {state.error}
      </p>
      <button type="submit" disabled={pending} className={buttonClassName("secondary", "min-h-12 w-full")}>
        {pending ? "Preparing…" : "Email me a PayPal invoice"}
      </button>
    </form>
  );
}
