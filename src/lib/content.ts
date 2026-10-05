import type { ImageId } from "./images";

export const inr = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export const steps = [
  {
    title: "You design your cake",
    body: "Pick the shape, size, flavours, colours and message. Add a reference photo if you have one.",
  },
  {
    title: "We confirm it",
    body: "Our baker checks the design, suggests tweaks if needed and confirms the final price and pick-up or delivery date.",
  },
  {
    title: "You pay by UPI or PayPal",
    body: "We send you a UPI request or a PayPal invoice. No online checkout and no card details on this site.",
  },
] as const;

export type FeaturedCake = {
  name: string;
  description: string;
  fromPrice: number;
  image: ImageId;
};

export const featuredCakes: FeaturedCake[] = [
  {
    name: "Raspberry Rose",
    description: "Vanilla sponge, raspberry jam and white chocolate ganache under piped buttercream roses.",
    fromPrice: 2200,
    image: "featured-raspberry-rose",
  },
  {
    name: "Chocolate Truffle",
    description: "Dark chocolate layers, glossy ganache drip and hand-rolled truffles.",
    fromPrice: 2000,
    image: "featured-chocolate-truffle",
  },
  {
    name: "Kesar Pista",
    description: "Saffron cream, crushed pistachio and dried rose petals. A festive favourite.",
    fromPrice: 2400,
    image: "featured-kesar-pista",
  },
  {
    name: "Berry Naked Cake",
    description: "Semi-naked vanilla bean layers piled high with fresh seasonal berries.",
    fromPrice: 1900,
    image: "featured-berry-naked",
  },
];

export const reviews = [
  {
    name: "Ananya R.",
    occasion: "Daughter's 6th birthday",
    quote: "I sent a rough sketch and they turned it into exactly the unicorn cake she wanted. Tasted even better than it looked.",
  },
  {
    name: "Karthik & Meera",
    occasion: "Wedding, 180 guests",
    quote: "Three tiers, fresh flowers, and not a single crumb out of place. The tasting session made choosing so easy.",
  },
  {
    name: "Priya S.",
    occasion: "Office Diwali party",
    quote: "Sixty cupcakes delivered on time, beautifully boxed. Paying by UPI after confirmation was refreshingly simple.",
  },
] as const;

export type Service = {
  slug: string;
  name: string;
  tagline: string;
  fromPrice: number;
  priceNote: string;
  included: string[];
  image: ImageId;
};

export const services: Service[] = [
  {
    slug: "birthday",
    name: "Birthday cakes",
    tagline: "From first birthdays to fiftieths, made around their favourite things.",
    fromPrice: 1800,
    priceNote: "for a 1 kg cake (serves 8–10)",
    included: [
      "Custom design consultation over chat",
      "Choice of 2 sponge flavours and 1 filling",
      "Message piped on the cake or a topper",
      "Candles and a sturdy cake box",
    ],
    image: "service-birthday",
  },
  {
    slug: "wedding",
    name: "Wedding cakes",
    tagline: "Tiered centrepieces designed with you, tasted before you decide.",
    fromPrice: 18000,
    priceNote: "for a 3-tier cake (serves 60–70)",
    included: [
      "Tasting box of 4 flavours",
      "Design session and sketch",
      "Fresh or sugar flowers to match your theme",
      "Delivery, set-up and cake stand at the venue",
    ],
    image: "service-wedding",
  },
  {
    slug: "corporate",
    name: "Corporate orders",
    tagline: "Launches, milestones and festive gifting for your team or clients.",
    fromPrice: 4500,
    priceNote: "for a 2 kg sheet cake (serves 20)",
    included: [
      "Your brand colours (logo toppers on request)",
      "GST invoice for your accounts team",
      "Individually boxed options for gifting",
      "Scheduled delivery to your office",
    ],
    image: "service-corporate",
  },
  {
    slug: "cupcakes",
    name: "Cupcakes",
    tagline: "Mix-and-match boxes for parties, gifts and just-because.",
    fromPrice: 900,
    priceNote: "for a box of 6",
    included: [
      "Up to 3 flavours per box",
      "Hand-piped frosting and toppings",
      "Colour-matched liners",
      "Gift box with ribbon",
    ],
    image: "service-cupcakes",
  },
  {
    slug: "dessert-tables",
    name: "Dessert tables",
    tagline: "A styled spread of cakes and treats for weddings, showers and big parties.",
    fromPrice: 25000,
    priceNote: "for about 50 guests",
    included: [
      "Centrepiece cake plus 5 kinds of mini desserts",
      "Stands, platters and backdrop styling",
      "Theme and colour planning call",
      "Set-up and pack-down at your venue",
    ],
    image: "service-dessert-table",
  },
];
