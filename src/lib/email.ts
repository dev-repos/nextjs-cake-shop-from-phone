import nodemailer, { type Transporter } from "nodemailer";
import { BUSINESS_NAME } from "./payments";

/**
 * Sends email through Gmail with an App Password (GMAIL_USER + GMAIL_APP_PASSWORD).
 * Without them the email is written to the server log instead, so the order flow still works.
 */

export type Email = { to: string; subject: string; text: string };

/** "sent" went out through Gmail; "logged" was printed because Gmail isn't set up. */
export type Delivery = "sent" | "logged";

function gmailAccount() {
  const user = process.env.GMAIL_USER?.trim();
  // Google shows App Passwords in groups of four ("abcd efgh ijkl mnop"); the spaces aren't part of it.
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  return user && pass ? { user, pass } : null;
}

/** Where new-order alerts go: ADMIN_EMAIL, or the Gmail account itself. */
export const adminEmail = () => process.env.ADMIN_EMAIL?.trim() || gmailAccount()?.user || null;

let transporter: Transporter | undefined;

/**
 * Sends `email`, or logs it when Gmail isn't configured. Throws if Gmail refuses it.
 * `logAs` replaces the recipient in logs, e.g. to mask a customer's address.
 */
export async function sendEmail(tag: string, email: Email, logAs = email.to): Promise<Delivery> {
  const account = gmailAccount();
  if (!account) {
    console.info(
      `[email] ${tag}: GMAIL_USER/GMAIL_APP_PASSWORD not set, so logged instead of sent.\n` +
        `  To: ${logAs}\n  Subject: ${email.subject}\n\n${email.text.replace(/^/gm, "  ")}\n`,
    );
    return "logged";
  }
  transporter ??= nodemailer.createTransport({
    service: "gmail",
    auth: account,
    // Nodemailer waits up to 2 minutes by default; fail sooner so the request finishes and the fallback runs.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  await transporter.sendMail({ from: { name: BUSINESS_NAME, address: account.user }, ...email });
  console.info(`[email] ${tag}: sent to ${logAs}.`);
  return "sent";
}
