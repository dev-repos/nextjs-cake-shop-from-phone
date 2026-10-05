"use client";

import { useId, useState, useSyncExternalStore, type ReactNode } from "react";
import { MESSAGE_MAX_LENGTH, PICKUP_LEAD_DAYS, type Cake, type Choice } from "@/lib/cakes";
import { inr } from "@/lib/content";

const CART_KEY = "frostwell-cart";

/** Earliest pickup as YYYY-MM-DD in the visitor's own time zone. */
function earliestPickup() {
  const d = new Date();
  d.setDate(d.getDate() + PICKUP_LEAD_DAYS);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// "Today" only exists in the browser; the static HTML renders without a minimum date.
const noSubscribe = () => () => {};
const useEarliestPickup = () => useSyncExternalStore(noSubscribe, earliestPickup, () => "");

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const extraLabel = (extra: number) => (extra ? `+${inr(extra)}` : "Included");

export function CakeCustomiser({ cake }: { cake: Cake }) {
  const [sizeIndex, setSizeIndex] = useState(0);
  const [flavourId, setFlavourId] = useState(cake.flavours[0].id);
  const [frostingId, setFrostingId] = useState(cake.frostings[0].id);
  const [message, setMessage] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [added, setAdded] = useState(false);
  const minDate = useEarliestPickup();
  const ids = useId();

  const size = cake.sizes[sizeIndex];
  const flavour = cake.flavours.find((f) => f.id === flavourId) ?? cake.flavours[0];
  const frosting = cake.frostings.find((f) => f.id === frostingId) ?? cake.frostings[0];
  const total = size.price + flavour.extra + frosting.extra;

  const dateError = !pickupDate
    ? "Choose a pickup date."
    : minDate && pickupDate < minDate
      ? `Pickup must be on or after ${formatDate(minDate)}.`
      : null;

  // Any change means the cart button should say "Add" again.
  const edit =
    <T,>(set: (v: T) => void) =>
    (v: T) => {
      set(v);
      setAdded(false);
    };

  function addToCart() {
    if (dateError) {
      setShowErrors(true);
      document.getElementById(`${ids}-date`)?.focus();
      return;
    }
    const item = {
      cake: cake.slug,
      name: cake.name,
      sizeInches: size.inches,
      flavour: flavour.name,
      frosting: frosting.name,
      message: message.trim(),
      pickupDate,
      price: total,
    };
    try {
      const cart = JSON.parse(localStorage.getItem(CART_KEY) ?? "[]");
      localStorage.setItem(CART_KEY, JSON.stringify([...(Array.isArray(cart) ? cart : []), item]));
    } catch {
      // Storage can be unavailable (private mode); the confirmation still shows.
    }
    setAdded(true);
  }

  return (
    <form
      className="mt-8 space-y-8"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        addToCart();
      }}
    >
      <Fieldset legend="Size">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {cake.sizes.map((s, i) => (
            <OptionCard
              key={s.inches}
              name={`${ids}-size`}
              checked={i === sizeIndex}
              onChange={() => edit(setSizeIndex)(i)}
            >
              <span className="block font-display text-lg font-semibold text-cocoa-900">
                {s.inches}&Prime;
              </span>
              <span className="block text-xs text-cocoa-500">serves {s.serves}</span>
              <span className="mt-1 block text-sm font-semibold text-raspberry-700">
                {inr(s.price)}
              </span>
            </OptionCard>
          ))}
        </div>
      </Fieldset>

      <ChoiceGroup
        legend="Flavour"
        name={`${ids}-flavour`}
        choices={cake.flavours}
        value={flavourId}
        onChange={edit(setFlavourId)}
      />

      <ChoiceGroup
        legend="Frosting"
        name={`${ids}-frosting`}
        choices={cake.frostings}
        value={frostingId}
        onChange={edit(setFrostingId)}
      />

      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor={`${ids}-message`} className="font-semibold text-cocoa-900">
            Message on top <span className="font-normal text-cocoa-500">(optional)</span>
          </label>
          <span
            id={`${ids}-message-count`}
            className={`text-sm tabular-nums ${message.length >= MESSAGE_MAX_LENGTH ? "font-semibold text-raspberry-700" : "text-cocoa-500"}`}
          >
            {message.length}/{MESSAGE_MAX_LENGTH}
          </span>
        </div>
        <input
          id={`${ids}-message`}
          type="text"
          value={message}
          maxLength={MESSAGE_MAX_LENGTH}
          onChange={(e) => edit(setMessage)(e.target.value.slice(0, MESSAGE_MAX_LENGTH))}
          placeholder="Happy birthday, Asha!"
          aria-describedby={`${ids}-message-count`}
          autoComplete="off"
          className="mt-2 block min-h-12 w-full rounded-2xl bg-white px-4 text-base text-cocoa-900 ring-1 ring-cocoa-900/15 placeholder:text-cocoa-500/60 focus:outline-2 focus:outline-raspberry-600"
        />
      </div>

      <div>
        <label htmlFor={`${ids}-date`} className="font-semibold text-cocoa-900">
          Pickup date
        </label>
        <p id={`${ids}-date-hint`} className="text-sm text-cocoa-500">
          {minDate
            ? `We need ${PICKUP_LEAD_DAYS} days. Earliest pickup: ${formatDate(minDate)}.`
            : `We need at least ${PICKUP_LEAD_DAYS} days to bake.`}
        </p>
        <input
          id={`${ids}-date`}
          type="date"
          required
          min={minDate || undefined}
          value={pickupDate}
          onChange={(e) => edit(setPickupDate)(e.target.value)}
          aria-invalid={showErrors && !!dateError}
          aria-describedby={`${ids}-date-hint ${ids}-date-error`}
          className="mt-2 block min-h-12 w-full rounded-2xl bg-white px-4 text-base text-cocoa-900 ring-1 ring-cocoa-900/15 focus:outline-2 focus:outline-raspberry-600 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-raspberry-600"
        />
        <p id={`${ids}-date-error`} className="mt-2 text-sm font-medium text-raspberry-700">
          {showErrors ? dateError : null}
        </p>
      </div>

      {/* Fixed to the bottom of the screen on phones, inline on larger screens. */}
      <div data-cart-bar className="fixed inset-x-0 bottom-0 z-30 border-t border-cocoa-900/10 bg-cream-50/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_-12px_rgb(43_26_18/0.25)] backdrop-blur md:static md:z-auto md:rounded-3xl md:border-0 md:bg-white md:p-6 md:shadow-sm md:ring-1 md:ring-cocoa-900/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-xs text-cocoa-500 md:text-sm">
              {size.inches}&Prime; · {flavour.name}
            </p>
            <p
              aria-live="polite"
              className="font-display text-2xl font-semibold tabular-nums text-cocoa-900"
            >
              {inr(total)}
            </p>
          </div>
          <button
            type="submit"
            className={`inline-flex min-h-12 shrink-0 items-center justify-center rounded-full px-6 text-base font-semibold text-white shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-raspberry-600 ${added ? "bg-cocoa-700" : "bg-raspberry-600 hover:bg-raspberry-700"}`}
          >
            {added ? "Added ✓" : "Add to cart"}
          </button>
        </div>
        <p role="status" className="mx-auto max-w-6xl text-sm text-cocoa-700 empty:hidden">
          {added ? `${cake.name} added to your cart.` : ""}
        </p>
      </div>
    </form>
  );
}

function Fieldset({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="font-semibold text-cocoa-900">{legend}</legend>
      <div className="mt-3">{children}</div>
    </fieldset>
  );
}

function ChoiceGroup({
  legend,
  name,
  choices,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  choices: Choice[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <Fieldset legend={legend}>
      <div className="grid gap-2">
        {choices.map((c) => (
          <OptionCard
            key={c.id}
            name={name}
            checked={c.id === value}
            onChange={() => onChange(c.id)}
            className="flex items-center justify-between gap-3 text-left"
          >
            <span className="font-medium text-cocoa-900">{c.name}</span>
            <span
              className={`shrink-0 text-sm ${c.extra ? "font-semibold text-raspberry-700" : "text-cocoa-500"}`}
            >
              {extraLabel(c.extra)}
            </span>
          </OptionCard>
        ))}
      </div>
    </Fieldset>
  );
}

function OptionCard({
  name,
  checked,
  onChange,
  className = "block text-center",
  children,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label
      className={`min-h-12 cursor-pointer rounded-2xl bg-white px-4 py-3 ring-1 ring-cocoa-900/15 transition-shadow has-checked:bg-raspberry-100/50 has-checked:ring-2 has-checked:ring-raspberry-600 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-raspberry-600 ${className}`}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      {children}
    </label>
  );
}
