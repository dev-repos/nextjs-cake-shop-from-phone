import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = {
  title: "Request your order",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-12 pt-6 sm:px-6 md:pb-20 md:pt-10">
      <Link
        href="/cart"
        className="inline-flex min-h-11 items-center text-sm font-medium text-cocoa-700 hover:text-raspberry-700"
      >
        ← Back to cart
      </Link>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-cocoa-900 sm:text-4xl">
        Request your order
      </h1>
      <CheckoutForm />
    </div>
  );
}
