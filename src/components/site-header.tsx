import Link from "next/link";
import { ButtonLink } from "./button-link";
import { Logo } from "./logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-cocoa-900/10 bg-cream-50/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Logo />
        <nav aria-label="Main" className="flex items-center gap-0 sm:gap-4">
          <Link
            href="/services"
            className="rounded-full px-2.5 py-2 text-sm font-medium text-cocoa-700 hover:text-raspberry-700 sm:text-base"
          >
            Services
          </Link>
          <ButtonLink href="/design" className="min-h-10 px-4 text-sm sm:px-5">
            <span className="sm:hidden">Design yours</span>
            <span className="hidden sm:inline">Design your cake</span>
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
