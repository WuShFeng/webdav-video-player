import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{
        hostname: 'q.qlogo.cn'
    }],
  },
};

export default nextConfig;
