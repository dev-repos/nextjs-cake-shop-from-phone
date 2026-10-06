import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/button-link";
import { SectionHeading } from "@/components/section-heading";
import { inr, services } from "@/lib/content";
import { siteImage } from "@/lib/images";

export const metadata: Metadata = {
  title: "Services & prices",
  description:
    "Birthday cakes, wedding cakes, corporate orders, cupcakes and dessert tables from Frostwell Cakes, with what's included and starting prices in rupees.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="bg-cream-100">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
          <SectionHeading
            as="h1"
            eyebrow="Services & prices"
            title="Something sweet for every occasion"
            intro="Every order is custom. Prices below are starting points; we confirm your exact quote before you pay by UPI or PayPal invoice."
          />
          <nav aria-label="Services" className="mt-8 flex flex-wrap gap-2">
            {services.map((s) => (
              <a
                key={s.slug}
                href={`#${s.slug}`}
                className="inline-flex min-h-11 items-center rounded-full bg-cream-50 px-4 text-sm font-medium text-cocoa-700 ring-1 ring-cocoa-900/10 hover:bg-raspberry-100 hover:text-raspberry-700"
              >
                {s.name}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6 md:space-y-12 md:py-20">
        {services.map((service, i) => {
          const img = siteImage(service.image);
          return (
            <article
              key={service.slug}
              id={service.slug}
              className="scroll-mt-24 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-cocoa-900/5 md:grid md:grid-cols-2"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                sizes="(min-width: 768px) 50vw, 100vw"
                className={`aspect-[3/2] h-full w-full object-cover ${i % 2 === 1 ? "md:order-last" : ""}`}
              />
              <div className="flex flex-col p-6 md:p-10">
                <h2 className="font-display text-2xl font-semibold text-cocoa-900 md:text-3xl">
                  {service.name}
                </h2>
                <p className="mt-2 text-cocoa-700">{service.tagline}</p>

                <p className="mt-5">
                  <span className="text-sm text-cocoa-500">Starting at </span>
                  <span className="font-display text-3xl font-semibold text-raspberry-700">
                    {inr(service.fromPrice)}
                  </span>
                  <span className="block text-sm text-cocoa-500">{service.priceNote}</span>
                </p>

                <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-cocoa-900">
                  What&apos;s included
                </h3>
                <ul className="mt-3 space-y-2">
                  {service.included.map((item) => (
                    <li key={item} className="flex gap-3 text-cocoa-700">
                      <svg
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                        className="mt-0.5 size-5 shrink-0 fill-raspberry-600"
                      >
                        <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>

                <ButtonLink href="/design" className="mt-8 self-start">
                  Design yours
                </ButtonLink>
              </div>
            </article>
          );
        })}
      </div>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 md:pb-24">
        <div className="rounded-3xl bg-cocoa-900 px-6 py-10 text-cream-100 md:flex md:items-center md:justify-between md:px-10">
          <div>
            <h2 className="font-display text-2xl font-semibold text-cream-50">How payment works</h2>
            <p className="mt-2 max-w-xl text-cream-200/80">
              There&apos;s no online checkout. Once we&apos;ve confirmed your design and date, we send a
              UPI request or a PayPal invoice. A 50% advance books your slot.
            </p>
          </div>
          <ButtonLink href="/#how-it-works" variant="secondary" className="mt-6 shrink-0 md:mt-0">
            See the 3 steps
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
