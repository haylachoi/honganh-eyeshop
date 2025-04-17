import type { NextConfig } from "next";

// const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
    // todo: use compiler
    // reactCompiler: true,
  },
  // todo: uncomment this
  // instrumentationHook: isProduction ? true : false,
  // cacheHandler: isProduction
  //   ? require.resolve("./cache/cache-handler.mjs")
  //   : undefined,
  // cacheMaxMemorySize: isProduction ? 1024 * 1024 * 20 : 0,
  // cacheHandler: require.resolve("./cache/cache-handler.mjs"),
};

export default nextConfig;
