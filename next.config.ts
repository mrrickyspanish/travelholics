import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
  // The free guides live outside public/ so they can only be reached through a
  // signed link. They are read at runtime, so tracing can't infer them.
  outputFileTracingIncludes: {
    "/api/guides/download": ["./private/guides/**"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/duck",
        destination: "/duck-hunt",
        permanent: false,
      },
      {
        source: "/duck/",
        destination: "/duck-hunt",
        permanent: false,
      },
      {
        source: "/duckhunt",
        destination: "/duck-hunt",
        permanent: false,
      },
      {
        source: "/duckhunt/",
        destination: "/duck-hunt",
        permanent: false,
      },
      {
        source: "/duck-hunt/",
        destination: "/duck-hunt",
        permanent: false,
      },
      {
        source: "/duck/navigator-of-the-seas",
        destination:
          "/duck-hunt?ship=navigator-of-the-seas&source=qr-navigator-of-the-seas",
        permanent: false,
      },
      {
        source: "/duck/navigator-of-the-seas/",
        destination:
          "/duck-hunt?ship=navigator-of-the-seas&source=qr-navigator-of-the-seas",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
