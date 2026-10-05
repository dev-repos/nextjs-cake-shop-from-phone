import type { ImageId } from "./images";

export const MESSAGE_MAX_LENGTH = 40;
export const PICKUP_LEAD_DAYS = 3;

export type SizeOption = {
  inches: 6 | 8 | 10;
  serves: string;
  price: number;
};

/** A flavour or frosting choice; `extra` is added to the size price. */
export type Choice = {
  id: string;
  name: string;
  extra: number;
};

export type Cake = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: ImageId;
  sizes: [SizeOption, SizeOption, SizeOption];
  flavours: Choice[];
  frostings: Choice[];
};

const serves = { 6: "6–8", 8: "12–15", 10: "20–25" } as const;

function sizes(six: number, eight: number, ten: number): Cake["sizes"] {
  return [
    { inches: 6, serves: serves[6], price: six },
    { inches: 8, serves: serves[8], price: eight },
    { inches: 10, serves: serves[10], price: ten },
  ];
}

export const cakes: Cake[] = [
  {
    slug: "raspberry-rose",
    name: "Raspberry Rose",
    tagline: "Piped buttercream roses with fresh raspberries.",
    description:
      "Soft vanilla sponge layered with raspberry jam and white chocolate ganache, finished with a garden of hand-piped roses from cream to deep raspberry.",
    image: "cake-raspberry-rose",
    sizes: sizes(1600, 2200, 3200),
    flavours: [
      { id: "vanilla-raspberry", name: "Vanilla & raspberry jam", extra: 0 },
      { id: "lemon-raspberry", name: "Lemon & raspberry", extra: 150 },
      { id: "rose-lychee", name: "Rose & lychee", extra: 250 },
    ],
    frostings: [
      { id: "vanilla-buttercream", name: "Vanilla buttercream", extra: 0 },
      { id: "white-chocolate", name: "White chocolate buttercream", extra: 200 },
      { id: "cream-cheese", name: "Cream cheese frosting", extra: 250 },
    ],
  },
  {
    slug: "chocolate-truffle",
    name: "Chocolate Truffle",
    tagline: "Glossy dark ganache and hand-rolled truffles.",
    description:
      "Moist dark chocolate layers with silky truffle filling, a mirror-glossy ganache coat and a crown of cocoa-dusted truffles.",
    image: "cake-chocolate-truffle",
    sizes: sizes(1500, 2000, 2900),
    flavours: [
      { id: "dark-chocolate", name: "Dark chocolate", extra: 0 },
      { id: "chocolate-hazelnut", name: "Chocolate hazelnut", extra: 200 },
      { id: "chocolate-orange", name: "Chocolate orange", extra: 150 },
    ],
    frostings: [
      { id: "dark-ganache", name: "Dark chocolate ganache", extra: 0 },
      { id: "milk-ganache", name: "Milk chocolate ganache", extra: 0 },
      { id: "mocha-buttercream", name: "Mocha buttercream", extra: 150 },
    ],
  },
  {
    slug: "kesar-pista",
    name: "Kesar Pista",
    tagline: "Saffron cream, pistachios and rose petals.",
    description:
      "Saffron-infused sponge with cardamom cream, edged in crushed pistachios and finished with dried rose petals. A festive favourite.",
    image: "cake-kesar-pista",
    sizes: sizes(1800, 2400, 3500),
    flavours: [
      { id: "saffron-cardamom", name: "Saffron & cardamom", extra: 0 },
      { id: "pistachio-rose", name: "Pistachio & rose", extra: 200 },
      { id: "rasmalai", name: "Rasmalai", extra: 300 },
    ],
    frostings: [
      { id: "saffron-cream", name: "Saffron whipped cream", extra: 0 },
      { id: "malai-buttercream", name: "Malai buttercream", extra: 150 },
      { id: "white-chocolate", name: "White chocolate ganache", extra: 200 },
    ],
  },
  {
    slug: "berry-naked",
    name: "Berry Naked Cake",
    tagline: "Semi-naked vanilla layers piled with berries.",
    description:
      "Three golden vanilla bean layers under a thin scraped coat, piled high with fresh seasonal berries. Light, pretty and not too sweet.",
    image: "cake-berry-naked",
    sizes: sizes(1400, 1900, 2700),
    flavours: [
      { id: "vanilla-bean", name: "Vanilla bean", extra: 0 },
      { id: "lemon", name: "Lemon", extra: 100 },
      { id: "almond", name: "Almond", extra: 150 },
    ],
    frostings: [
      { id: "cream-cheese", name: "Cream cheese frosting", extra: 0 },
      { id: "whipped-cream", name: "Whipped cream", extra: 0 },
      { id: "mascarpone", name: "Mascarpone cream", extra: 250 },
    ],
  },
  {
    slug: "red-velvet",
    name: "Red Velvet",
    tagline: "Deep red sponge and tangy cream cheese.",
    description:
      "Velvety cocoa-red layers with a gentle buttermilk tang, sandwiched and coated in smooth cream cheese frosting with a ring of red velvet crumbs.",
    image: "cake-red-velvet",
    sizes: sizes(1500, 2100, 3000),
    flavours: [
      { id: "classic", name: "Classic red velvet", extra: 0 },
      { id: "white-chocolate", name: "Red velvet & white chocolate", extra: 150 },
      { id: "raspberry", name: "Red velvet & raspberry", extra: 150 },
    ],
    frostings: [
      { id: "cream-cheese", name: "Cream cheese frosting", extra: 0 },
      { id: "vanilla-buttercream", name: "Vanilla buttercream", extra: 0 },
      { id: "white-chocolate", name: "White chocolate ganache", extra: 200 },
    ],
  },
  {
    slug: "salted-caramel",
    name: "Salted Caramel Coffee",
    tagline: "Coffee sponge with a salted caramel drip.",
    description:
      "Coffee-soaked sponge with salted caramel filling, caramel buttercream and a glossy drip, topped with crunchy caramel shards.",
    image: "cake-salted-caramel",
    sizes: sizes(1600, 2200, 3100),
    flavours: [
      { id: "coffee", name: "Coffee & salted caramel", extra: 0 },
      { id: "vanilla", name: "Vanilla & salted caramel", extra: 0 },
      { id: "banana", name: "Banana & salted caramel", extra: 150 },
    ],
    frostings: [
      { id: "caramel-buttercream", name: "Caramel buttercream", extra: 0 },
      { id: "coffee-buttercream", name: "Coffee buttercream", extra: 0 },
      { id: "brown-butter", name: "Brown butter cream cheese", extra: 200 },
    ],
  },
];

export function getCake(slug: string) {
  return cakes.find((cake) => cake.slug === slug);
}
