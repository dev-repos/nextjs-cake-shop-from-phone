# Frostwell Cakes

A mobile-first custom-cake ordering site (Next.js, deployed on Vercel), built step by step **entirely from a phone**
with Claude Code in a cloud environment, for the *AI System Design Deep Dive* tutorial
"Next.js cake shop from your phone" (vertical video, link coming soon).

Frostwell Cakes is a made-up bakery. Prices are in INR and every payment path is a **demo stub**: no real money moves.

## Steps

Each step is one prompt sent from the Claude app; the repo is tagged `step-01` … `step-06` after each merged PR.
The prompts, in order, will be listed here as the build progresses.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build
```

Next.js 16 (App Router) + TypeScript + Tailwind CSS v4. Pages: `/` (landing), `/services`, `/cakes` (shop) with a customiser at `/cakes/<slug>`, and a `/design` placeholder.

## Images

Every image the site uses is listed in [`images/prompts.json`](images/prompts.json), with its size, alt text and a
detailed generation prompt. Until the real photos exist, the site shows SVG placeholders from `public/images/<id>.svg`
(regenerate them with `npm run placeholders`). To switch to real photos:

1. Save each generated image as `public/images/<id>.webp` at the listed size.
2. Set `IMAGE_EXT` to `"webp"` in `src/lib/images.ts`.

## Licence

MIT
