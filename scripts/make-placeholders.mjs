// Writes an SVG placeholder for every image listed in images/prompts.json
// to public/images/<id>.svg. Run with `npm run placeholders`.
import { readFile, writeFile, mkdir } from "node:fs/promises";

const root = new URL("..", import.meta.url);
const { images } = JSON.parse(
  await readFile(new URL("images/prompts.json", root), "utf8"),
);
const outDir = new URL("public/images/", root);
await mkdir(outDir, { recursive: true });

const escape = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

for (const { id, width: w, height: h, alt } of images) {
  const r = Math.min(w, h);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${escape(alt)}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fbf3e6"/>
      <stop offset="1" stop-color="#f1dfc8"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <circle cx="${w * 0.82}" cy="${h * 0.18}" r="${r * 0.22}" fill="#c2335f" opacity="0.12"/>
  <circle cx="${w * 0.12}" cy="${h * 0.88}" r="${r * 0.28}" fill="#4a2c20" opacity="0.08"/>
  <g transform="translate(${w / 2} ${h / 2 - r * 0.06}) scale(${r / 400})" fill="none" stroke="#4a2c20" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity="0.55">
    <path d="M-90 40 h180 v50 h-180 z"/>
    <path d="M-60 -10 h120 v50 h-120 z"/>
    <path d="M-90 58 q22 14 45 0 t45 0 t45 0 t45 0" stroke="#c2335f"/>
    <path d="M0 -10 v-30"/>
    <path d="M0 -52 q8 8 0 14 q-8 -6 0 -14" fill="#c2335f" stroke="#c2335f"/>
  </g>
  <text x="50%" y="${h / 2 + r * 0.26}" text-anchor="middle" font-family="Georgia, serif" font-size="${Math.round(r * 0.055)}" fill="#4a2c20">${escape(id)}</text>
  <text x="50%" y="${h / 2 + r * 0.33}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.round(r * 0.035)}" fill="#4a2c20" opacity="0.6">${w} × ${h} placeholder</text>
</svg>
`;
  await writeFile(new URL(`${id}.svg`, outDir), svg);
  console.log(`public/images/${id}.svg`);
}
