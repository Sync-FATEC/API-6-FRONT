import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  async rewrites() {
    if (!isProd) return [];

    return [
      {
        source: "/api/:path*",
        destination:
          "http://asg-backend-alb-85114170.us-east-1.elb.amazonaws.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;