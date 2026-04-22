import { NextResponse } from "next/server";
import Stripe from "stripe";

import { MERCH_PRODUCTS } from "@/lib/shop-catalog";

interface CheckoutRequest {
  productId?: string;
  color?: string;
  size?: string;
  quantity?: number;
}

export async function POST(request: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeKey) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured yet. Add STRIPE_SECRET_KEY to enable live merch checkout.",
      },
      { status: 500 },
    );
  }

  const body = (await request.json()) as CheckoutRequest;
  const product = MERCH_PRODUCTS.find((item) => item.id === body.productId);

  if (!product) {
    return NextResponse.json({ error: "Invalid product selection." }, { status: 400 });
  }

  const size = typeof body.size === "string" ? body.size : "";
  const color = typeof body.color === "string" ? body.color : "";
  const quantity = Math.min(10, Math.max(1, Number(body.quantity ?? 1)));

  if (!product.sizes.includes(size) || !product.colors.includes(color)) {
    return NextResponse.json(
      { error: "Please choose a valid size and color." },
      { status: 400 },
    );
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: "2026-03-25.dahlia",
  });

  const url = new URL(request.url);
  const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? url.origin;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    billing_address_collection: "auto",
    success_url: `${siteOrigin}/shop?checkout=success`,
    cancel_url: `${siteOrigin}/shop?checkout=cancelled`,
    line_items: [
      {
        quantity,
        price_data: {
          currency: product.currency,
          unit_amount: product.price,
          product_data: {
            name: product.stripeLabel,
            description: `${color} · ${size}`,
            metadata: {
              product_id: product.id,
              color,
              size,
            },
          },
        },
      },
    ],
    metadata: {
      product_id: product.id,
      product_name: product.name,
      color,
      size,
      quantity: String(quantity),
      source: "travelholics-shop",
    },
  });

  return NextResponse.json({ url: session.url });
}
