import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Electron - files generated in 'out' directory
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
