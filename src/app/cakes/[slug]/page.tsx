import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CakeCustomiser } from "@/components/cake-customiser";
import { cakes, getCake } from "@/lib/cakes";
import { siteImage } from "@/lib/images";

export const dynamicParams = false;

export function generateStaticParams() {
  return cakes.map((cake) => ({ slug: cake.slug }));
}

export async function generateMetadata({ params }: PageProps<"/cakes/[slug]">): Promise<Metadata> {
  const cake = getCake((await params).slug);
  if (!cake) return {};
  return { title: cake.name, description: cake.description };
}

export default async function CakePage({ params }: PageProps<"/cakes/[slug]">) {
  const cake = getCake((await params).slug);
  if (!cake) notFound();
  const img = siteImage(cake.image);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-6 md:pb-20 md:pt-10">
      <Link
        href="/cakes"
        className="inline-flex min-h-11 items-center text-sm font-medium text-cocoa-700 hover:text-raspberry-700"
      >
        ← All cakes
      </Link>

      <div className="mt-2 grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="md:sticky md:top-24 md:self-start">
          <Image
            src={img.src}
            alt={img.alt}
            width={img.width}
            height={img.height}
            preload
            sizes="(min-width: 768px) 50vw, 100vw"
            className="aspect-square w-full rounded-[2rem] object-cover shadow-xl shadow-cocoa-900/10"
          />
        </div>

        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-cocoa-900 sm:text-4xl">
            {cake.name}
          </h1>
          <p className="mt-3 text-cocoa-700">{cake.description}</p>
          <CakeCustomiser cake={cake} />
        </div>
      </div>
    </div>
  );
}
