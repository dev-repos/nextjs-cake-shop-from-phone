# Frostwell Cakes

A mobile-first custom-cake ordering site (Next.js, deployed on Vercel), built step by step **entirely from a phone**
with Claude Code in a cloud environment, for the *AI System Design Deep Dive* tutorial
"Next.js cake shop from your phone" (vertical video, link coming soon).

Frostwell Cakes is a made-up bakery. Prices are in INR and every payment path is a **demo stub**: no real money moves.

## Steps

Live site: **https://nextjs-cake-shop-from-phone.vercel.app**

Each step was one prompt sent to a Claude Code cloud session from the Claude app on a phone. After each merged PR the
repo is tagged, so you can check out any step (`git checkout step-04`).

| Tag | Step | PR |
| --- | --- | --- |
| `step-01` | Landing and services pages | #1 |
| `step-02` | Images with Gemini | #2 |
| `step-03` | Deploy to Vercel | (no PR: Vercel connector) |
| `step-04` | Catalogue and cake customiser | #3 |
| `step-05` | Cart, checkout and order request | #4 |
| `step-06` | Confirm and pay (UPI + PayPal stubs), phone check | #5 |
| `step-07` | Order emails with Gmail | #6 |

Step 3 has no code change: Claude created the Vercel project with the Vercel connector, so `step-03` is the commit
it deployed. The Gemini key lives only in the cloud environment as `GEMINI_API_KEY`; the site never needs it,
because the images are committed.

## Prompts, in order

Sent word for word.

### Step 1

> Create a Next.js app in this repo for a made-up custom cake shop called "Frostwell Cakes": latest Next.js with the App Router, TypeScript and Tailwind. Design it mobile-first for a 390 px phone, then make it look good on a laptop. Build two pages: a landing page (hero with a "Design your cake" button; how ordering works in 3 steps: you design your cake, we confirm it, you pay by UPI or PayPal invoice, with no online checkout; featured cakes; a few reviews; footer) and a services page (birthday, wedding, corporate, cupcakes and dessert tables, each with what's included and a starting price in rupees). Warm cream, chocolate and raspberry colours. Use placeholder images for now, and list every image the site needs in images/prompts.json with a detailed prompt for each: I'll have them generated next. Run lint and the build, then push a branch and open a PR.

### Step 2

> Add a script, npm run images, that reads images/prompts.json and makes each image with Google's Gemini image model (Nano Banana) through the Gemini API. Read my key from the GEMINI_API_KEY environment variable this environment provides, never print it and never write it into the repo or any file. Skip images that already exist unless I pass --force. Save them as WebP in public/images sized for phones. Run it, look at every image and redo any with text, odd hands or unappetising cake. Then wire them in with next/image and good alt text, push and open a PR, and send me phone-width screenshots of both pages.

### Step 3

> Deploy this site to Vercel with the Vercel connector: create a project named nextjs-cake-shop-from-phone linked to github.com/dev-repos/nextjs-cake-shop-from-phone, production from main and a preview deployment for every pull request. The site must build without any Gemini key, because the images are already in the repo. Check the live pages load, then reply with the production URL.

### Step 4

> Add the shop: a /cakes page with six cakes, and a page for each cake where I customise it: size (6, 8 or 10 inch, each with its price in rupees), flavour, frosting, a message on top of up to 40 characters, and a pickup date at least 3 days from today. The price updates as I choose, and a sticky "Add to cart" bar stays at the bottom on a phone. Add the six cake images to images/prompts.json and run npm run images for just the new ones. Push and open a PR.

### Step 5

> Add a cart and an order request, with no online checkout. The cart is saved on the device so it survives a reload, with quantities and a total in rupees. Checkout asks for name, phone, email, pickup date and notes, and says: "No payment now — after we confirm your cake, we'll send an invoice to your email and phone." It posts to an /api/orders route that checks everything with Zod, keeps the email and phone for the invoice, logs that the invoice will be sent after confirmation instead of sending anything, and returns an order number. The order page shows the summary, the status "Awaiting confirmation" and the next steps: we confirm, you get an invoice by email and text, you pay by UPI or PayPal. There's no database yet, so keep the order in my browser. Test the whole flow at 390 px in a headless browser, send me the screenshots, then push and open a PR.

### Step 6

> Now the part after we confirm an order. Add a demo-only /admin/orders/[id] page behind an ADMIN_TOKEN check where the bakery confirms an order. Confirming makes a confirmed order link signed with ORDER_SECRET, which is what the invoice email and text would carry, and logs the invoice instead of sending it. Opening that link shows the order as Confirmed with a Pay section offering two ways to pay. UPI: a upi://pay link with our UPI ID, the amount in rupees and the order number as the note, as a button that opens GPay, PhonePe or Paytm, plus a QR code of the same link. Take the UPI ID from UPI_VPA and default to the fake demo.only@invalid so no real account can be paid. PayPal, for customers outside India: a stub that logs the PayPal invoice it would create with the Invoicing API, ready for PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET but never calling PayPal. No real money moves anywhere. Then check the whole site at 320, 360, 390 and 430 px: no sideways scrolling, buttons at least 44 px, text at least 16 px, the right keyboard for phone and email. Fix what you find, document the env vars in .env.example, tell me what you changed, push and open a PR.

### Step 7

> Now send real emails with Gmail, using nodemailer and a Gmail App Password from GMAIL_USER and GMAIL_APP_PASSWORD. When an order comes in, email the bakery at ADMIN_EMAIL with the order summary and a link to its admin page carrying a key made for that order alone, signed from ORDER_SECRET, so every order has its own key and nobody can guess it from the order number. That replaces the shared ADMIN_TOKEN login. When the bakery accepts the order with that link, email the customer a link with their own token to view the confirmed order and pay by UPI or PayPal. Keep the text message logged as before. If the Gmail variables aren't set, log the emails instead of sending them, so it still works without them. Update .env.example and the README, test the whole flow with the logged emails, push and open a PR.

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
