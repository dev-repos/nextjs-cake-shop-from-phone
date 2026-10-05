// Generates every photo listed in images/prompts.json with Google's Gemini
// image model (Nano Banana) and saves it as public/images/<id>.webp, resized
// to the width × height given in the prompts file.
//
//   npm run images                      # make any images that don't exist yet
//   npm run images -- --force           # regenerate all of them
//   npm run images -- --only hero-cake,og-image --force
//   npm run images -- --model gemini-3.1-flash-image
//
// Needs GEMINI_API_KEY in the environment. The key is sent in a request header
// and is never logged or written to disk.
import { readFile, mkdir, access, stat } from "node:fs/promises";
import { parseArgs } from "node:util";
import sharp from "sharp";

const DEFAULT_MODEL = "gemini-2.5-flash-image";
const API = "https://generativelanguage.googleapis.com/v1beta/models";

// Aspect ratios the Gemini image models accept. Anything else (e.g. 1.91:1 for
// the share image) is generated at the closest one and cropped by sharp.
const SUPPORTED_RATIOS = ["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"];

const { values: args } = parseArgs({
  options: {
    force: { type: "boolean", default: false },
    only: { type: "string" },
    model: { type: "string", default: process.env.GEMINI_IMAGE_MODEL || DEFAULT_MODEL },
    quality: { type: "string", default: "80" },
  },
});

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not set. Export it in your environment and try again.");
  process.exit(1);
}

const root = new URL("..", import.meta.url);
const { style, images } = JSON.parse(await readFile(new URL("images/prompts.json", root), "utf8"));
const outDir = new URL("public/images/", root);
await mkdir(outDir, { recursive: true });

const only = args.only ? new Set(args.only.split(",").map((s) => s.trim())) : null;
if (only) {
  const unknown = [...only].filter((id) => !images.some((img) => img.id === id));
  if (unknown.length) {
    console.error(`Unknown image id(s): ${unknown.join(", ")}`);
    process.exit(1);
  }
}

const exists = (url) => access(url).then(() => true, () => false);

function closestRatio(width, height) {
  const target = width / height;
  return SUPPORTED_RATIOS.reduce((best, r) => {
    const [w, h] = r.split(":").map(Number);
    const [bw, bh] = best.split(":").map(Number);
    return Math.abs(Math.log(w / h / target)) < Math.abs(Math.log(bw / bh / target)) ? r : best;
  });
}

async function generate(img) {
  const aspectRatio = closestRatio(img.width, img.height);
  const text = [
    img.prompt,
    `Style: ${style}`,
    "Photograph only: absolutely no text, lettering, numbers, logos, signage or watermarks anywhere in the image.",
  ].join("\n\n");

  const res = await fetch(`${API}/${args.model}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({
      contents: [{ parts: [{ text }] }],
      generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio } },
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${body.error?.message ?? res.statusText}`);
  }
  const parts = body.candidates?.[0]?.content?.parts ?? [];
  const data = parts.find((p) => p.inlineData?.data)?.inlineData.data;
  if (!data) {
    const reason = body.candidates?.[0]?.finishReason ?? body.promptFeedback?.blockReason ?? "no image returned";
    throw new Error(`Gemini returned no image (${reason})`);
  }
  return Buffer.from(data, "base64");
}

let failed = 0;
for (const img of images) {
  if (only && !only.has(img.id)) continue;
  const out = new URL(`${img.id}.webp`, outDir);
  const jpegOut = img.jpegCopy ? new URL(img.jpegCopy, root) : null;
  if (!args.force && (await exists(out)) && (!jpegOut || (await exists(jpegOut)))) {
    console.log(`skip   public/images/${img.id}.webp (exists, use --force to redo)`);
    continue;
  }

  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const raw = await generate(img);
      const resized = sharp(raw).resize(img.width, img.height, { fit: "cover", position: "attention" });
      await resized.clone().webp({ quality: Number(args.quality), effort: 6 }).toFile(out.pathname);
      if (jpegOut) {
        await resized.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(jpegOut.pathname);
        console.log(`wrote  ${img.jpegCopy}`);
      }
      const { size } = await stat(out);
      console.log(`wrote  public/images/${img.id}.webp  ${img.width}×${img.height}  ${Math.round(size / 1024)} KB`);
      lastError = undefined;
      break;
    } catch (err) {
      lastError = err;
      console.warn(`retry  ${img.id} (attempt ${attempt} failed: ${err.message})`);
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
  if (lastError) {
    failed++;
    console.error(`FAILED ${img.id}: ${lastError.message}`);
  }
}

if (failed) process.exit(1);
