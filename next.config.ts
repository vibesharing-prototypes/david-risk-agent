import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Self-hosting / Docker: emits `.next/standalone`. Vercel ignores this and uses its own runtime. */
  output: "standalone",
};

export default nextConfig;
