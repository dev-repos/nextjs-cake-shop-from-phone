import Link from "next/link";

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <Link
      href="/"
      className={`flex min-h-11 min-w-11 shrink-0 items-center gap-2 whitespace-nowrap font-display text-lg font-semibold sm:text-xl tracking-tight ${tone === "dark" ? "text-cocoa-900" : "text-cream-50"}`}
    >
      <svg viewBox="0 0 64 64" aria-hidden="true" className="size-7 shrink-0 sm:size-8">
        <rect width="64" height="64" rx="14" fill="#c2335f" />
        <path d="M14 34h36v16H14z" fill="#fffaf3" />
        <path d="M20 22h24v12H20z" fill="#f3e4cf" />
        <path
          d="M14 38q4.5 4 9 0t9 0 9 0 9 0"
          fill="none"
          stroke="#4a2c20"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path d="M32 22v-7" stroke="#fffaf3" strokeWidth="3" strokeLinecap="round" />
      </svg>
      {/* Icon only on the narrowest phones so the header fits at 320px; the name stays for screen readers. */}
      <span className={tone === "dark" ? "max-[24rem]:sr-only" : undefined}>
        Frostwell<span className={`${tone === "dark" ? "text-raspberry-600 max-sm:sr-only" : "text-raspberry-100"}`}> Cakes</span>
      </span>
    </Link>
  );
}
