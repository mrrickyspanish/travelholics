import { NextResponse } from "next/server";
import Stripe from "stripe";

import { MERCH_PRODUCTS } from "@/lib/shop-catalog";

interface SingleCheckoutRequest {
  productId: string;
  color?: string;
  size?: string;
  quantity?: number;
}

interface CartItem {
  productId: string;
  quantity: number;
  color?: string;
  size?: string;
}

interface CartCheckoutRequest {
  items: CartItem[];
}

type CheckoutRequest = SingleCheckoutRequest | CartCheckoutRequest;

function isCartRequest(body: CheckoutRequest): body is CartCheckoutRequest {
  return "items" in body && Array.isArray((body as CartCheckoutRequest).items);
}

export async function POST(request: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeKey) {
    return NextResponse.json(
      { error: "Stripe is not configured yet. Add STRIPE_SECRET_KEY to enable live merch checkout." },
      { status: 500 }
    );
  }

  const body = (await request.json()) as CheckoutRequest;
  const stripe = new Stripe(stripeKey, { apiVersion: "2026-03-25.dahlia" });
  const url = new URL(request.url);
  const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? url.origin;

  // ── Cart checkout (multiple items) ─────────────────────────
  if (isCartRequest(body)) {
    if (!body.items.length) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of body.items) {
      const product = MERCH_PRODUCTS.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json({ error: `Unknown product: ${item.productId}` }, { status: 400 });
      }

      const quantity = Math.min(10, Math.max(1, Number(item.quantity ?? 1)));
      const unitAmount =
        product.bundlePrice && product.bundleQuantity && quantity >= product.bundleQuantity
          ? Math.round(product.bundlePrice / product.bundleQuantity)
          : product.price;

      const color = typeof item.color === "string" ? item.color : (product.colors[0] ?? "");
      const size = typeof item.size === "string" ? item.size : (product.sizes[0] ?? "");

      lineItems.push({
        quantity,
        price_data: {
          currency: product.currency,
          unit_amount: unitAmount,
          product_data: {
            name: product.stripeLabel,
            ...(color && size ? { description: `${color} · ${size}` } : {}),
            metadata: { product_id: product.id, color, size },
          },
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      billing_address_collection: "auto",
      success_url: `${siteOrigin}/shop?checkout=success`,
      cancel_url: `${siteOrigin}/shop-full`,
      line_items: lineItems,
      metadata: { source: "travelholics-cart" },
    });

    return NextResponse.json({ url: session.url });
  }

  // ── Single product checkout ─────────────────────────────────
  const product = MERCH_PRODUCTS.find((p) => p.id === body.productId);
  if (!product) {
    return NextResponse.json({ error: "Invalid product selection." }, { status: 400 });
  }

  const size = typeof body.size === "string" ? body.size : (product.sizes[0] ?? "");
  const color = typeof body.color === "string" ? body.color : (product.colors[0] ?? "");
  const quantity = Math.min(10, Math.max(1, Number(body.quantity ?? 1)));

  // Only enforce size/color match when a product actually has real options
  const hasRealOptions = product.sizes.some((s) => s !== "One Size" && s !== "Standard");
  if (hasRealOptions && (!product.sizes.includes(size) || !product.colors.includes(color))) {
    return NextResponse.json({ error: "Please choose a valid size and color." }, { status: 400 });
  }

  const unitAmount =
    product.bundlePrice && product.bundleQuantity && quantity >= product.bundleQuantity
      ? Math.round(product.bundlePrice / product.bundleQuantity)
      : product.price;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    billing_address_collection: "auto",
    success_url: `${siteOrigin}/shop?checkout=success`,
    cancel_url: `${siteOrigin}/shop-full`,
    line_items: [
      {
        quantity,
        price_data: {
          currency: product.currency,
          unit_amount: unitAmount,
          product_data: {
            name: product.stripeLabel,
            description: color && size ? `${color} · ${size}` : undefined,
            metadata: { product_id: product.id, color, size },
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
      unit_amount: String(unitAmount),
      source: "travelholics-shop",
    },
  });

  return NextResponse.json({ url: session.url });
}
