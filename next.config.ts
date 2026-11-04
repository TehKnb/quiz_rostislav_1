import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Railway restores .next/cache between builds, and a restored cache shipped new scripts with the previous commit's CSS.
    turbopackFileSystemCacheForBuild: false,
  },
};

export default nextConfig;
