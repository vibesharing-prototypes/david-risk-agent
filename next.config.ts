import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Do not set `output: "standalone"` here unless you run `node .next/standalone/server.js`.
   * Using `next start` together with `standalone` is unsupported and can yield a blank/broken UI.
   * For Docker, this image uses `next start` with a full `.next` + `node_modules` copy.
   */
};

export default nextConfig;
