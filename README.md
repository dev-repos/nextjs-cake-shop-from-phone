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

Next.js 16 (App Router) + TypeScript + Tailwind CSS v4. Pages: `/` (landing), `/services`, `/cakes` (shop) with a customiser at `/cakes/<slug>`, `/cart`, `/checkout`, `/orders/<number>`, the bakery's `/admin/orders/<number>` (opened from the new-order email), and a `/design` placeholder.

## Confirming an order and paying

There is no database yet, so orders travel in links signed with `ORDER_SECRET` (copy `.env.example` to `.env.local`).

1. A customer sends an order request. The bakery gets an email at `ADMIN_EMAIL` with the order summary and a link to
   `/admin/orders/<number>`. The link carries a key made for that order alone (an HMAC of the order number keyed with
   `ORDER_SECRET`), so it opens that order and no other, and nobody can work it out from the order number. There is no
   shared admin password.
2. The bakery opens the link and taps **Confirm**. The customer gets an email with their own link to the confirmed
   order. The text message is still only written to the server log (there is no SMS provider).
3. The customer's link opens the order as **Confirmed** with a Pay section: a `upi://pay` button and QR code (to the fake
   `demo.only@invalid` unless `UPI_VPA` is set), and a PayPal option that only logs the Invoicing API requests it would make.

No real money moves anywhere.

### Email (Gmail)

Emails go out through Gmail with [nodemailer](https://nodemailer.com/) when these are set:

| Variable | What it is |
| --- | --- |
| `GMAIL_USER` | The Gmail address that sends the emails. |
| `GMAIL_APP_PASSWORD` | A 16-character [App Password](https://myaccount.google.com/apppasswords) for that account (needs 2-Step Verification). Not the normal password. |
| `ADMIN_EMAIL` | The bakery's inbox for new-order emails. Defaults to `GMAIL_USER`. |

If `GMAIL_USER` or `GMAIL_APP_PASSWORD` is missing, nothing is sent: each email is written to the server log instead,
links included, so the whole flow still works locally. If Gmail refuses a new-order email, the admin link is logged as
an error so the order isn't lost.

Anyone holding an order's admin link can confirm that order, so don't forward the new-order email.

## Images

Every image the site uses is listed in [`images/prompts.json`](images/prompts.json), with its size, alt text and a
detailed generation prompt. Until the real photos exist, the site shows SVG placeholders from `public/images/<id>.svg`
(regenerate them with `npm run placeholders`). To switch to real photos:

1. Save each generated image as `public/images/<id>.webp` at the listed size.
2. Set `IMAGE_EXT` to `"webp"` in `src/lib/images.ts`.

## Licence

MIT
