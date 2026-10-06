import Link from "next/link";
import { ButtonLink } from "./button-link";
import { CartLink } from "./cart-link";
import { Logo } from "./logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-cocoa-900/10 bg-cream-50/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
        <Logo />
        <nav aria-label="Main" className="flex items-center gap-0 sm:gap-4">
          <Link
            href="/cakes"
            className="inline-flex min-h-11 items-center rounded-full px-2.5 text-base font-medium text-cocoa-700 hover:text-raspberry-700"
          >
            Cakes
          </Link>
          <Link
            href="/services"
            className="inline-flex min-h-11 items-center rounded-full px-2.5 text-base font-medium text-cocoa-700 hover:text-raspberry-700 max-sm:hidden"
          >
            Services
          </Link>
          <ButtonLink href="/design" className="px-4 sm:px-5">
            <span className="sm:hidden">Design</span>
            <span className="hidden sm:inline">Design your cake</span>
          </ButtonLink>
          <CartLink />
        </nav>
      </div>
    </header>
  );
}
