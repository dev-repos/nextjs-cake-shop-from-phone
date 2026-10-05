export function SectionHeading({
  eyebrow,
  title,
  intro,
  as: Tag = "h2",
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-wider text-raspberry-700">{eyebrow}</p>
      <Tag className="mt-2 font-display text-3xl font-semibold tracking-tight text-cocoa-900 md:text-4xl">
        {title}
      </Tag>
      {intro && <p className="mt-3 text-lg text-cocoa-700">{intro}</p>}
    </div>
  );
}
