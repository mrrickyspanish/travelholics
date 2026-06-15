import type { Metadata } from "next";
import { MERCH_PRODUCTS } from "@/lib/shop-catalog";
import ProductPageClient from "./product-page-client";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = MERCH_PRODUCTS.find((p) => p.id === slug);
  if (!product) return { title: "Product Not Found" };

  const description =
    product.description ??
    `Shop ${product.name} from Travelholics — cruise lifestyle merch and travel essentials.`;

  return {
    title: product.name,
    description,
    alternates: { canonical: `/shop/${slug}` },
    openGraph: {
      title: product.name,
      description,
      url: `/shop/${slug}`,
      type: "website",
      siteName: "Travelholics",
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  return <ProductPageClient slug={slug} />;
}
