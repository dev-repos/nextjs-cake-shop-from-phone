import { inr } from "@/lib/content";
import type { PricedItem } from "@/lib/order";

/** Size, flavour, frosting and message, as one line of detail under the cake name. */
export function ItemDetails({ item }: { item: PricedItem }) {
  return (
    <>
      <p className="text-sm text-cocoa-500">
        {item.sizeInches}&Prime; · {item.flavour} · {item.frosting}
      </p>
      {item.message && <p className="text-sm text-cocoa-500">Message: &ldquo;{item.message}&rdquo;</p>}
    </>
  );
}

/** Read-only list of items with a total, for checkout and the order page. */
export function OrderSummary({ items, total }: { items: PricedItem[]; total: number }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-cocoa-900/5">
      <ul className="divide-y divide-cocoa-900/10">
        {items.map((item, i) => (
          <li key={i} className="flex justify-between gap-4 py-3 first:pt-0">
            <div className="min-w-0">
              <p className="font-semibold text-cocoa-900">
                {item.quantity} × {item.name}
              </p>
              <ItemDetails item={item} />
            </div>
            <p className="shrink-0 font-semibold tabular-nums text-cocoa-900">{inr(item.lineTotal)}</p>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex items-baseline justify-between border-t border-cocoa-900/10 pt-4">
        <p className="font-semibold text-cocoa-900">Total</p>
        <p className="font-display text-2xl font-semibold tabular-nums text-cocoa-900">{inr(total)}</p>
      </div>
    </div>
  );
}
