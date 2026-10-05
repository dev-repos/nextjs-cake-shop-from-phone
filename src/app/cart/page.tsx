import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = {
  title: "Your cart",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-12 pt-6 sm:px-6 md:pb-20 md:pt-10">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-cocoa-900 sm:text-4xl">
        Your cart
      </h1>
      <CartView />
    </div>
  );
}
