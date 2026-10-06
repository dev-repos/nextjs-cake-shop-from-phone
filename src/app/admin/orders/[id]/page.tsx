import type { Metadata } from "next";
import type { ReactNode } from "react";
import { OrderSummary } from "@/components/order-items";
import { adminEnabled, isAdmin } from "@/lib/admin-auth";
import { formatDate, orderSchema } from "@/lib/order";
import { verifyToken } from "@/lib/signed-link";
import { ConfirmForm, SignInForm } from "./forms";

export const metadata: Metadata = { title: "Confirm order", robots: { index: false, follow: false } };

export default async function AdminOrderPage({ params, searchParams }: PageProps<"/admin/orders/[id]">) {
  const { id } = await params;
  const { order: token } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 pb-12 pt-6 sm:px-6 md:pb-20 md:pt-10">
      <div>
        <p className="font-semibold uppercase tracking-wider text-raspberry-700">Bakery admin · demo only</p>
        <h1 className="mt-1 break-words font-display text-3xl font-semibold tracking-tight text-cocoa-900">
          Order {id}
        </h1>
      </div>
      <AdminBody id={id} token={token} />
    </div>
  );
}

async function AdminBody({ id, token }: { id: string; token: string | string[] | undefined }) {
  if (!adminEnabled()) {
    return <Card>The bakery admin is switched off. Set ADMIN_TOKEN on the server to use it.</Card>;
  }
  if (!(await isAdmin())) {
    return (
      <Card>
        <p className="mb-4">Sign in with the bakery&apos;s admin token to review this order.</p>
        <SignInForm />
      </Card>
    );
  }

  const order = verifyToken("pending", token, orderSchema);
  if (typeof token !== "string" || !order || order.number !== id) {
    return <Card>This order link isn&apos;t valid. Open the link from the new-order alert again.</Card>;
  }

  const { customer, invoiceTo } = order;
  return (
    <>
      <dl className="grid gap-3 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-cocoa-900/5 sm:grid-cols-2">
        <Detail label="Customer">{customer.name}</Detail>
        <Detail label="Pickup">{formatDate(customer.pickupDate)}</Detail>
        <Detail label="Phone">
          <a href={`tel:${invoiceTo.phone}`} className="inline-flex min-h-11 items-center text-raspberry-700 underline">
            {invoiceTo.phone}
          </a>
        </Detail>
        <Detail label="Email">
          <a href={`mailto:${invoiceTo.email}`} className="inline-flex min-h-11 items-center break-all text-raspberry-700 underline">
            {invoiceTo.email}
          </a>
        </Detail>
        {customer.notes && (
          <div className="sm:col-span-2">
            <Detail label="Notes">{customer.notes}</Detail>
          </div>
        )}
      </dl>
      <OrderSummary items={order.items} total={order.total} />
      <ConfirmForm token={token} />
    </>
  );
}

function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-3xl bg-white p-6 text-cocoa-700 shadow-sm ring-1 ring-cocoa-900/5">{children}</div>;
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-cocoa-500">{label}</dt>
      <dd className="font-semibold text-cocoa-900">{children}</dd>
    </div>
  );
}
