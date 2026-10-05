import type { Metadata } from "next";
import { ButtonLink } from "@/components/button-link";

export const metadata: Metadata = {
  title: "Design your cake",
};

// Placeholder so the "Design your cake" buttons don't 404; the designer comes in a later step.
export default function DesignPage() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center sm:px-6 md:py-28">
      <p className="text-sm font-semibold uppercase tracking-wider text-raspberry-700">Coming soon</p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-cocoa-900">
        The cake designer is in the oven
      </h1>
      <p className="mt-4 text-lg text-cocoa-700">
        Soon you&apos;ll pick shape, size, flavours and decorations right here. Until then, browse our
        services and starting prices.
      </p>
      <ButtonLink href="/services" className="mt-8">
        See services &amp; prices
      </ButtonLink>
    </section>
  );
}
