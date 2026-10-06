import QRCode from "qrcode";
import type { ReactNode } from "react";
import { inr } from "@/lib/content";
import { formatDate, type ConfirmedOrder } from "@/lib/order";
import { DEMO_UPI_VPA, upiPayLink, upiVpa } from "@/lib/payments";
import { buttonClassName } from "./button-link";
import { OrderSummary } from "./order-items";
import { PaypalInvoiceButton } from "./paypal-invoice-button";

/** The page behind the invoice link: the order, now confirmed, with ways to pay. */
export async function ConfirmedOrderView({ order, token }: { order: ConfirmedOrder; token: string }) {
  const vpa = upiVpa();
  const upiLink = upiPayLink(order, vpa);
  const qr = await QRCode.toString(upiLink, { type: "svg", margin: 1, errorCorrectionLevel: "M" });

  return (
    <div className="space-y-8">
      <div>
        <p className="font-semibold uppercase tracking-wider text-raspberry-700">Your cake is confirmed</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-cocoa-900 sm:text-4xl">
          Thank you, {order.customer.name.split(" ")[0]}!
        </h1>
        <dl className="mt-4 grid grid-cols-2 gap-3">
          <Tile label="Order number" wide>
            <span className="font-display text-2xl tabular-nums">{order.number}</span>
          </Tile>
          <Tile label="Status">
            <span className="flex items-center gap-1.5">
              <span aria-hidden className="size-2 rounded-full bg-emerald-600" />
              Confirmed
            </span>
          </Tile>
          <Tile label="Pickup">{formatDate(order.customer.pickupDate)}</Tile>
        </dl>
      </div>

      <section>
        <h2 className="font-display text-xl font-semibold text-cocoa-900">Summary</h2>
        <div className="mt-3">
          <OrderSummary items={order.items} total={order.total} />
        </div>
      </section>

      <section aria-labelledby="pay-heading" className="space-y-4">
        <div>
          <h2 id="pay-heading" className="font-display text-xl font-semibold text-cocoa-900">
            Pay {inr(order.total)}
          </h2>
          <p className="mt-1 rounded-2xl bg-amber-50 p-3 text-cocoa-700 ring-1 ring-amber-600/20">
            Demo shop: please don&apos;t pay. {vpa === DEMO_UPI_VPA ? "The UPI ID below is fake and" : "PayPal"} can&apos;t
            take real money.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-cocoa-900/5">
          <h3 className="font-semibold text-cocoa-900">UPI (in India)</h3>
          <p className="mt-1 text-cocoa-700">Opens GPay, PhonePe, Paytm or any UPI app with the amount filled in.</p>
          <a href={upiLink} className={buttonClassName("primary", "mt-4 min-h-12 w-full")}>
            Pay {inr(order.total)} with a UPI app
          </a>
          <div className="mt-5 flex flex-col items-center gap-3 border-t border-cocoa-900/10 pt-5">
            <p className="text-center text-cocoa-700">On a computer? Scan with your phone&apos;s UPI app.</p>
            <div
              role="img"
              aria-label={`UPI QR code to pay ${inr(order.total)} to ${vpa}`}
              className="w-full max-w-56 rounded-2xl bg-white p-2 ring-1 ring-cocoa-900/10 [&_svg]:h-auto [&_svg]:w-full"
              dangerouslySetInnerHTML={{ __html: qr }}
            />
            <dl className="w-full space-y-1 text-cocoa-700">
              <div className="flex flex-wrap justify-between gap-x-4">
                <dt>UPI ID</dt>
                <dd className="break-all font-mono text-cocoa-900">{vpa}</dd>
              </div>
              <div className="flex flex-wrap justify-between gap-x-4">
                <dt>Note</dt>
                <dd className="font-mono text-cocoa-900">{order.number}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-cocoa-900/5">
          <h3 className="font-semibold text-cocoa-900">PayPal (outside India)</h3>
          <p className="mt-1 mb-4 text-cocoa-700">
            We&apos;ll email a PayPal invoice you can pay by card or PayPal balance. We never ask for card details here.
          </p>
          <PaypalInvoiceButton token={token} email={order.email} />
        </div>
      </section>
    </div>
  );
}

function Tile({ label, wide, children }: { label: string; wide?: boolean; children: ReactNode }) {
  return (
    <div className={`min-w-0 rounded-2xl bg-white p-4 ring-1 ring-cocoa-900/5 ${wide ? "col-span-2" : ""}`}>
      <dt className="text-cocoa-500">{label}</dt>
      <dd className="break-words font-semibold text-cocoa-900">{children}</dd>
    </div>
  );
}
