import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ];
  },
};

export default nextConfig;
