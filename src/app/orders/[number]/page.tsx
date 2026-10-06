import type { Metadata } from "next";
import { ButtonLink } from "@/components/button-link";
import { ConfirmedOrderView } from "@/components/confirmed-order";
import { OrderDetails } from "@/components/order-details";
import { confirmedOrderSchema } from "@/lib/order";
import { verifyToken } from "@/lib/signed-link";

export async function generateMetadata({ params }: PageProps<"/orders/[number]">): Promise<Metadata> {
  return { title: `Order ${(await params).number}`, robots: { index: false } };
}

export default async function OrderPage({ params, searchParams }: PageProps<"/orders/[number]">) {
  const { number } = await params;
  // `t` is the signed confirmation the invoice email and text link to; without it the order comes from this device.
  const { t } = await searchParams;
  const confirmed = t === undefined ? undefined : verifyToken("confirmed", t, confirmedOrderSchema);

  return (
    <div className="mx-auto max-w-2xl px-4 pb-12 pt-6 sm:px-6 md:pb-20 md:pt-10">
      {confirmed === undefined ? (
        <OrderDetails number={number} />
      ) : confirmed && confirmed.number === number && typeof t === "string" ? (
        <ConfirmedOrderView order={confirmed} token={t} />
      ) : (
        <div className="rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-cocoa-900/5">
          <h1 className="font-display text-2xl font-semibold text-cocoa-900">This link doesn&apos;t work</h1>
          <p className="mt-2 text-cocoa-700">
            It may have been cut off when copied. Open the link from your invoice email or text again.
          </p>
          <ButtonLink href="/cakes" className="mt-4">
            Browse cakes
          </ButtonLink>
        </div>
      )}
    </div>
  );
}
