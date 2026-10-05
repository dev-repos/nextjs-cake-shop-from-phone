import Link from "next/link";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="bg-cocoa-900 text-cream-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-3">
          <Logo tone="light" />
          <p className="max-w-xs text-sm text-cream-200/80">
            Custom cakes baked to order in small batches. Designed by you, confirmed by us, paid by
            UPI or PayPal invoice.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-cream-300">Explore</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-raspberry-100">Home</Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-raspberry-100">Services &amp; prices</Link>
            </li>
            <li>
              <Link href="/design" className="hover:text-raspberry-100">Design your cake</Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-cream-300">Visit &amp; contact</h2>
          <address className="mt-3 space-y-2 text-sm not-italic text-cream-200/90">
            <p>12 Baker&apos;s Lane, Indiranagar, Bengaluru</p>
            <p>Tue–Sun, 10 am – 7 pm</p>
            <p>
              <a href="mailto:hello@frostwell.example" className="hover:text-raspberry-100">
                hello@frostwell.example
              </a>
            </p>
          </address>
        </div>
      </div>
      <div className="border-t border-cream-100/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-cream-200/60 sm:px-6">
          © {new Date().getFullYear()} Frostwell Cakes. A made-up bakery for a demo: no real orders or
          payments are taken.
        </p>
      </div>
    </footer>
  );
}
