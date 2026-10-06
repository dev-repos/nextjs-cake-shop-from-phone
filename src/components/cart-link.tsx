"use client";

import Link from "next/link";
import { useCartCount } from "@/lib/cart";

export function CartLink() {
  const count = useCartCount();
  return (
    <Link
      href="/cart"
      aria-label={count ? `Cart, ${count} item${count === 1 ? "" : "s"}` : "Cart"}
      className="relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-cocoa-700 hover:text-raspberry-700"
    >
      <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.2L21 8H6.2" />
        <circle cx="9.5" cy="20" r="1.2" />
        <circle cx="17.5" cy="20" r="1.2" />
      </svg>
      {count > 0 && (
        <span className="absolute right-0 top-0.5 flex min-w-5 items-center justify-center rounded-full bg-raspberry-600 px-1 text-xs font-semibold tabular-nums text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
