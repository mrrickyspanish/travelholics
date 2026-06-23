import { Resend } from "resend";

const ALERT_EMAIL = process.env.ALERT_EMAIL ?? "ricky@creativeeyestudios.com";

/**
 * Best-effort email notification for failures on money/lead-capture paths
 * (Stripe webhook, checkout, forms, newsletter, duck hunt). Never throws —
 * a broken alert must not take down the request that triggered it.
 */
export async function sendAlert(subject: string, context: Record<string, unknown> = {}) {
  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    console.error(`[alert] Could not send "${subject}" — RESEND_API_KEY is not set.`, context);
    return;
  }

  const fromAddress = process.env.RESEND_FROM_EMAIL ?? "Travelholics <onboarding@resend.dev>";
  const resend = new Resend(resendKey);

  const detailLines = Object.entries(context)
    .map(([key, value]) => `${key}: ${typeof value === "string" ? value : JSON.stringify(value)}`)
    .join("\n");

  try {
    await resend.emails.send({
      from: fromAddress,
      to: [ALERT_EMAIL],
      subject: `[Travelholics Alert] ${subject}`,
      text: `${subject}\n\n${detailLines}\n\nTime: ${new Date().toISOString()}`,
    });
  } catch (err) {
    console.error("[alert] Failed to send alert email:", err);
  }
}
