import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

import { sendAlert } from "@/lib/alerts";

const OWNER_EMAIL = "rjsmom1_68@yahoo.com";
const BCC_EMAIL = "ricky@creativeeyestudios.com";

export async function POST(request: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe not configured." }, { status: 500 });
  }

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2026-03-25.dahlia" });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook verification failed.";
    console.error("Stripe webhook verification error:", message);
    await sendAlert("Stripe webhook signature verification failed", { message });
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.warn("RESEND_API_KEY not set — skipping order confirmation emails.");
      return NextResponse.json({ received: true });
    }

    const resend = new Resend(resendKey);
    const fromAddress = process.env.RESEND_FROM_EMAIL ?? "Travelholics <onboarding@resend.dev>";

    const customerEmail = session.customer_details?.email ?? session.customer_email ?? null;
    const customerName = session.customer_details?.name ?? "Traveler";
    const totalFormatted = `$${((session.amount_total ?? 0) / 100).toFixed(2)}`;

    const lineItemsResult = await stripe.checkout.sessions
      .listLineItems(session.id, { limit: 20 })
      .catch(() => null);

    const itemRows = (lineItemsResult?.data ?? [])
      .map(
        (item) =>
          `<tr>
            <td style="padding:10px 0;border-bottom:1px solid #f0ede8;font-size:14px;color:#1a1a2e;">${item.description ?? "Item"}</td>
            <td style="padding:10px 0;border-bottom:1px solid #f0ede8;font-size:14px;color:#1a1a2e;text-align:center;">×${item.quantity ?? 1}</td>
            <td style="padding:10px 0;border-bottom:1px solid #f0ede8;font-size:14px;color:#1a1a2e;text-align:right;">$${((item.amount_total ?? 0) / 100).toFixed(2)}</td>
          </tr>`,
      )
      .join("");

    // Buyer confirmation email
    if (customerEmail) {
      await resend.emails
        .send({
          from: fromAddress,
          to: [customerEmail],
          subject: "Your Travelholics order is confirmed ✓",
          html: buyerEmailHtml({ customerName, itemRows, totalFormatted, sessionId: session.id }),
        })
        .catch((err) => {
          console.error("Buyer confirmation email failed:", err);
          return sendAlert("Buyer order confirmation email failed", {
            sessionId: session.id,
            customerEmail,
            error: err instanceof Error ? err.message : String(err),
          });
        });
    }

    // Owner sale notification
    await resend.emails
      .send({
        from: fromAddress,
        to: [OWNER_EMAIL],
        bcc: [BCC_EMAIL],
        subject: `New shop order — ${totalFormatted} from ${customerName}`,
        html: ownerEmailHtml({ customerName, customerEmail, itemRows, totalFormatted, sessionId: session.id }),
      })
      .catch((err) => {
        console.error("Owner notification email failed:", err);
        return sendAlert("Owner sale notification email failed", {
          sessionId: session.id,
          totalFormatted,
          customerName,
          error: err instanceof Error ? err.message : String(err),
        });
      });
  }

  return NextResponse.json({ received: true });
}

function buyerEmailHtml({
  customerName,
  itemRows,
  totalFormatted,
  sessionId,
}: {
  customerName: string;
  itemRows: string;
  totalFormatted: string;
  sessionId: string;
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#faf9f6;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f6;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">

        <!-- Header -->
        <tr>
          <td style="background:#0e125c;padding:32px 40px;text-align:center;">
            <p style="margin:0;font-family:Georgia,serif;font-size:22px;color:#ffffff;letter-spacing:0.05em;">TRAVELHOLICS</p>
            <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.6);letter-spacing:0.1em;text-transform:uppercase;">Order Confirmation</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 32px;">
            <p style="margin:0 0 8px;font-size:24px;color:#0e125c;">You're all set, ${customerName}.</p>
            <p style="margin:0 0 28px;font-size:15px;color:#666;line-height:1.6;">
              Thanks for your order! We're getting it packed up and headed your way.
              You'll receive a shipping confirmation with tracking once it's on the move.
            </p>

            <!-- Order summary -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-top:2px solid #0e125c;margin-bottom:24px;">
              <tr>
                <th style="padding:10px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#999;text-align:left;font-weight:600;">Item</th>
                <th style="padding:10px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#999;text-align:center;font-weight:600;">Qty</th>
                <th style="padding:10px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#999;text-align:right;font-weight:600;">Total</th>
              </tr>
              ${itemRows}
              <tr>
                <td colspan="2" style="padding:14px 0 0;font-size:15px;font-weight:700;color:#0e125c;">Order Total</td>
                <td style="padding:14px 0 0;font-size:15px;font-weight:700;color:#0e125c;text-align:right;">${totalFormatted}</td>
              </tr>
            </table>

            <!-- Shipping info -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f6;border-radius:12px;padding:20px;margin-bottom:28px;">
              <tr>
                <td>
                  <p style="margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#999;font-weight:600;">Shipping</p>
                  <p style="margin:0;font-size:14px;color:#333;line-height:1.6;">
                    Processing takes 2–3 business days. Standard delivery is 5–7 business days after that.
                    We'll email your tracking number as soon as it ships.
                  </p>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 6px;font-size:14px;color:#333;line-height:1.6;">
              Questions? Reply to this email or reach us at
              <a href="mailto:hello@yotravelholic.com" style="color:#e05c4b;text-decoration:none;">hello@yotravelholic.com</a>.
            </p>
            <p style="margin:20px 0 0;font-size:14px;color:#999;">Order ref: ${sessionId.slice(-12).toUpperCase()}</p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0e125c;padding:24px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.5);">
              © ${new Date().getFullYear()} Travelholics &nbsp;·&nbsp;
              <a href="https://yotravelholic.com/shipping" style="color:rgba(255,255,255,0.5);text-decoration:underline;">Shipping</a> &nbsp;·&nbsp;
              <a href="https://yotravelholic.com/returns" style="color:rgba(255,255,255,0.5);text-decoration:underline;">Returns</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function ownerEmailHtml({
  customerName,
  customerEmail,
  itemRows,
  totalFormatted,
  sessionId,
}: {
  customerName: string;
  customerEmail: string | null;
  itemRows: string;
  totalFormatted: string;
  sessionId: string;
}) {
  return `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:24px;background:#f5f5f5;font-family:Arial,sans-serif;">
  <div style="max-width:560px;background:#fff;border-radius:8px;padding:28px;box-shadow:0 1px 6px rgba(0,0,0,0.08);">
    <h2 style="margin:0 0 4px;color:#0e125c;font-size:20px;">New shop order 🎉</h2>
    <p style="margin:0 0 20px;color:#555;font-size:14px;">Someone just bought from Travelholics.</p>
    <p style="margin:0 0 4px;font-size:14px;color:#333;"><strong>Customer:</strong> ${customerName}</p>
    <p style="margin:0 0 16px;font-size:14px;color:#333;"><strong>Email:</strong> ${customerEmail ?? "Not provided"}</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-top:2px solid #0e125c;margin-bottom:16px;">
      <tr>
        <th style="padding:8px 0;font-size:12px;text-align:left;color:#999;">Item</th>
        <th style="padding:8px 0;font-size:12px;text-align:center;color:#999;">Qty</th>
        <th style="padding:8px 0;font-size:12px;text-align:right;color:#999;">Total</th>
      </tr>
      ${itemRows}
      <tr>
        <td colspan="2" style="padding:12px 0 0;font-weight:700;color:#0e125c;">Order Total</td>
        <td style="padding:12px 0 0;font-weight:700;color:#0e125c;text-align:right;">${totalFormatted}</td>
      </tr>
    </table>
    <p style="margin:0;font-size:12px;color:#aaa;">Stripe session: ${sessionId}</p>
  </div>
</body>
</html>`;
}
