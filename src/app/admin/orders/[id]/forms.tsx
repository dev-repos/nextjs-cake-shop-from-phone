"use client";

import { useActionState } from "react";
import { buttonClassName } from "@/components/button-link";
import { confirmOrder, signIn, type ConfirmState, type SignInState } from "./actions";

export function SignInForm() {
  const [state, action, pending] = useActionState(signIn, {} as SignInState);
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="admin-token" className="font-semibold text-cocoa-900">
          Admin token
        </label>
        <input
          id="admin-token"
          name="token"
          type="password"
          required
          autoComplete="current-password"
          aria-invalid={!!state.error}
          aria-describedby="admin-token-error"
          className="mt-2 block min-h-12 w-full rounded-2xl bg-white px-4 text-base text-cocoa-900 ring-1 ring-cocoa-900/15 focus:outline-2 focus:outline-raspberry-600 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-raspberry-600"
        />
        <p id="admin-token-error" role="alert" className="mt-2 font-medium text-raspberry-700 empty:hidden">
          {state.error}
        </p>
      </div>
      <button type="submit" disabled={pending} className={buttonClassName("primary", "min-h-12 w-full")}>
        {pending ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}

export function ConfirmForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(confirmOrder.bind(null, token), {} as ConfirmState);

  if (state.link) {
    return (
      <div className="space-y-4 rounded-3xl bg-emerald-50 p-5 ring-1 ring-emerald-700/20">
        <p className="font-semibold text-cocoa-900">Confirmed. Invoice logged, not sent.</p>
        <p className="text-cocoa-700">
          The invoice email and text carry this link. In this demo they are written to the server log instead.
        </p>
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
