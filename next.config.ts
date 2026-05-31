import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  trailingSlash: true,
  async rewrites() {
    // Em DEV: reescreve /api/* para localhost:8000
    // Em PROD: deixa relativo (Vercel roteará conforme configurado)
    if (isDev) {
      return [
        {
          source: "/api/:path*",
          destination: "http://127.0.0.1:8000/api/:path*",
        },
      ];
    }
    return [];
  },
};

export default nextConfig;