import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { cakes } from "@/lib/cakes";
import { inr } from "@/lib/content";
import { siteImage } from "@/lib/images";

export const metadata: Metadata = {
  title: "Shop cakes",
  description:
    "Six Frostwell favourites in 6, 8 or 10 inch sizes. Choose the flavour, frosting and message, and pick it up from 3 days out.",
};

export default function CakesPage() {
  return (
    <>
      <section className="bg-cream-100">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <SectionHeading
            as="h1"
            eyebrow="Shop"
            title="Pick a cake, make it yours"
            intro="Choose a size, flavour, frosting and a message on top. Pick-up from 3 days out."
          />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <ul className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {cakes.map((cake) => {
            const img = siteImage(cake.image);
            return (
              <li key={cake.slug}>
                <Link
                  href={`/cakes/${cake.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-cocoa-900/5 transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-raspberry-600"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="flex flex-1 flex-col gap-1 p-3 sm:p-5">
                    <h2 className="font-display text-base font-semibold leading-snug text-cocoa-900 sm:text-xl">
                      {cake.name}
                    </h2>
                    <p className="hidden text-sm text-cocoa-700 sm:block">{cake.tagline}</p>
                    <p className="mt-auto pt-1 text-sm font-semibold text-raspberry-700">
                      from {inr(cake.sizes[0].price)}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
