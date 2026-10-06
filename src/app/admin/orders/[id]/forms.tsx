"use client";

import { useActionState } from "react";
import { buttonClassName } from "@/components/button-link";
import { confirmOrder, type ConfirmState } from "./actions";

const SENT_NOTE = {
  sent: ["Confirmed. Invoice emailed to the customer.", "The email carries this link. The text message is still only logged."],
  logged: [
    "Confirmed. Invoice logged, not sent.",
    "Gmail isn't set up (GMAIL_USER and GMAIL_APP_PASSWORD), so the invoice email and text were written to the server log.",
  ],
  failed: ["Confirmed, but the invoice email didn't go out.", "Send the customer this link yourself."],
};

export function ConfirmForm({ token, adminKey }: { token: string; adminKey: string }) {
  const [state, action, pending] = useActionState(confirmOrder.bind(null, token, adminKey), {} as ConfirmState);

  if (state.link) {
    const [title, note] = SENT_NOTE[state.email ?? "failed"];
    return (
      <div className="space-y-4 rounded-3xl bg-emerald-50 p-5 ring-1 ring-emerald-700/20">
        <p role="status" className="font-semibold text-cocoa-900">
          {title}
        </p>
        <p className="text-cocoa-700">{note}</p>
        <a href={state.link} className={buttonClassName("primary", "w-full")}>
          Open the customer&apos;s link
        </a>
        <details className="rounded-2xl bg-white ring-1 ring-cocoa-900/10">
          <summary className="flex min-h-11 cursor-pointer items-center px-4 font-semibold text-cocoa-900">
            Show the link
          </summary>
          <p className="break-all px-4 pb-4 font-mono text-base text-cocoa-700">{state.link}</p>
        </details>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-3">
      <p role="alert" className="font-medium text-raspberry-700 empty:hidden">
        {state.error}
      </p>
      <button type="submit" disabled={pending} className={buttonClassName("primary", "min-h-12 w-full")}>
        {pending ? "Confirming…" : "Confirm order and send invoice"}
      </button>
    </form>
  );
}
