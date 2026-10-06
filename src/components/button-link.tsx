import Link from "next/link";
import type { ComponentProps } from "react";

const variants = {
  primary:
    "bg-raspberry-600 text-white shadow-sm hover:bg-raspberry-700 focus-visible:outline-raspberry-600",
  secondary:
    "bg-cream-50 text-cocoa-900 ring-1 ring-cocoa-900/15 hover:bg-cream-100 focus-visible:outline-cocoa-700",
} as const;

type Variant = keyof typeof variants;

/** Shared with plain <a> and <button> elements that need to look like ButtonLink. */
export const buttonClassName = (variant: Variant = "primary", className = "") =>
  `inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-full px-6 text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 ${variants[variant]} ${className}`;

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
};

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ButtonLinkProps) {
  return <Link className={buttonClassName(variant, className)} {...props} />;
}
