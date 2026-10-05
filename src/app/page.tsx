import Image from "next/image";
import { ButtonLink } from "@/components/button-link";
import { SectionHeading } from "@/components/section-heading";
import { featuredCakes, inr, reviews, steps } from "@/lib/content";
import { siteImage } from "@/lib/images";

export default function Home() {
  const hero = siteImage("hero-cake");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream-100">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 size-72 rounded-full bg-raspberry-100 blur-3xl md:size-[28rem]"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 pb-12 pt-8 sm:px-6 md:grid-cols-2 md:gap-12 md:py-20">
          <div className="space-y-6">
            <p className="inline-flex rounded-full bg-cream-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-raspberry-700 ring-1 ring-raspberry-600/20">
              Custom cakes · Bengaluru
            </p>
            <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-cocoa-900 sm:text-5xl lg:text-6xl">
              Your cake, <span className="italic text-raspberry-600">your way</span>, baked with care.
            </h1>
            <p className="max-w-md text-lg text-cocoa-700">
              Choose the flavours, colours and little details. We&apos;ll confirm everything with you
              before a single egg is cracked.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/design" className="min-h-12 px-8 text-lg">
                Design your cake
              </ButtonLink>
              <ButtonLink href="/services" variant="secondary" className="min-h-12">
                See services &amp; prices
              </ButtonLink>
            </div>
            <p className="text-sm text-cocoa-500">
              Pay by UPI or PayPal invoice after we confirm. No online checkout.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-sm md:max-w-none">
            <Image
              src={hero.src}
              alt={hero.alt}
              width={hero.width}
              height={hero.height}
              preload
              sizes="(min-width: 768px) 50vw, 100vw"
              className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-xl shadow-cocoa-900/10"
            />
            <div className="absolute -bottom-4 left-4 rounded-2xl bg-cream-50 px-4 py-3 shadow-lg ring-1 ring-cocoa-900/5 md:-left-6">
              <p className="font-display text-2xl font-semibold text-cocoa-900">4.9 ★</p>
              <p className="text-xs text-cocoa-500">from 300+ happy orders</p>
            </div>
          </div>
        </div>
      </section>

      {/* How ordering works */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <SectionHeading
          eyebrow="How ordering works"
          title="Three simple steps"
          intro="No carts, no checkout pages. Just a real conversation with the person baking your cake."
        />
        <ol className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="relative rounded-3xl bg-white p-6 shadow-sm ring-1 ring-cocoa-900/5"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-raspberry-600 font-display text-lg font-semibold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-cocoa-900">{step.title}</h3>
              <p className="mt-2 text-cocoa-700">{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-cocoa-700">
          <span className="font-semibold">We accept:</span>
          <span className="rounded-full bg-cream-200 px-3 py-1">UPI</span>
          <span className="rounded-full bg-cream-200 px-3 py-1">PayPal invoice</span>
        </div>
      </section>

      {/* Featured cakes */}
      <section className="bg-cream-100 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Featured cakes"
            title="A few favourites to start from"
            intro="Use one as a starting point and make it yours, or start from scratch."
          />
          <ul className="-mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 lg:gap-6">
            {featuredCakes.map((cake) => {
              const img = siteImage(cake.image);
              return (
                <li
                  key={cake.name}
                  className="w-[78%] shrink-0 snap-start overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-cocoa-900/5 sm:w-auto"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 80vw"
                    className="aspect-[4/5] w-full object-cover"
                  />
                  <div className="space-y-2 p-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-lg font-semibold text-cocoa-900">{cake.name}</h3>
                      <p className="shrink-0 text-sm font-semibold text-raspberry-700">
                        from {inr(cake.fromPrice)}
                      </p>
                    </div>
                    <p className="text-sm text-cocoa-700">{cake.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <SectionHeading eyebrow="Reviews" title="Sweet words from our customers" />
        <ul className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
          {reviews.map((review) => (
            <li key={review.name}>
              <figure className="flex h-full flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-cocoa-900/5">
                <p aria-label="5 out of 5 stars" className="text-raspberry-600">
                  ★★★★★
                </p>
                <blockquote className="mt-3 flex-1 text-cocoa-700">“{review.quote}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex size-10 items-center justify-center rounded-full bg-cream-200 font-semibold text-cocoa-700"
                  >
                    {review.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block font-semibold text-cocoa-900">{review.name}</span>
                    <span className="block text-sm text-cocoa-500">{review.occasion}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 md:pb-24">
        <div className="rounded-[2rem] bg-raspberry-600 px-6 py-12 text-center text-white md:py-16">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">Ready to dream up your cake?</h2>
          <p className="mx-auto mt-3 max-w-md text-raspberry-100">
            It takes about five minutes. We&apos;ll reply within a day to confirm the details.
          </p>
          <ButtonLink
            href="/design"
            variant="secondary"
            className="mt-8 min-h-12 px-8 text-lg ring-0"
          >
            Design your cake
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
