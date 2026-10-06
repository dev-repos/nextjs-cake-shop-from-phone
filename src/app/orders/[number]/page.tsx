import type { Metadata } from "next";
import { OrderDetails } from "@/components/order-details";

export async function generateMetadata({ params }: PageProps<"/orders/[number]">): Promise<Metadata> {
  return { title: `Order ${(await params).number}`, robots: { index: false } };
}

export default async function OrderPage({ params }: PageProps<"/orders/[number]">) {
  const { number } = await params;
  return (
    <div className="mx-auto max-w-2xl px-4 pb-12 pt-6 sm:px-6 md:pb-20 md:pt-10">
      <OrderDetails number={number} />
    </div>
  );
}
