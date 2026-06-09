import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  // NÃO adicionar trailing slash em /api/* para evitar 307 redirects
  // Páginas normais (.tsx) terão trailing slash por padrão do Next.js
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