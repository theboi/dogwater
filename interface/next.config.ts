import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/model/:path*",
        destination: "http://127.0.0.1:5328/:path*", // Proxy to Backend for Python Flask API
      },
    ];
  },
};

export default nextConfig;
