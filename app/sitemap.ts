import type { MetadataRoute } from "next";
import { destinations } from "@/lib/destinations";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yotravelholic.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const destinationPages: MetadataRoute.Sitemap = destinations.map((d) => ({
    url: `${siteUrl}/cruises/${d.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  return [
    ...destinationPages,
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/shop`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/collaborate`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/shipping`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/returns`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
