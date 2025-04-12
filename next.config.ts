import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
    // todo: use compiler
    // reactCompiler: true,
  },
  // toto:  max cache entry size is 2MB, use cache handler
};

export default nextConfig;
