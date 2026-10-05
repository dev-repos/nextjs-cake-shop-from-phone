import prompts from "../../images/prompts.json";

// Switch to "webp" once the generated photos are saved as public/images/<id>.webp.
export const IMAGE_EXT: "svg" | "webp" = "svg";

type PromptEntry = (typeof prompts.images)[number];
export type ImageId = PromptEntry["id"];

export type SiteImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

const byId = new Map(prompts.images.map((img) => [img.id, img]));

export function siteImage(id: ImageId): SiteImage {
  const img = byId.get(id);
  if (!img) throw new Error(`Unknown image "${id}": add it to images/prompts.json`);
  return {
    src: `/images/${img.id}.${IMAGE_EXT}`,
    alt: img.alt,
    width: img.width,
    height: img.height,
  };
}
