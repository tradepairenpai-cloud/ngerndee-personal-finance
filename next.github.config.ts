import type { NextConfig } from "next";
const repository = "/ngerndee-personal-finance";
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  assetPrefix: repository,
  trailingSlash: true
};
export default nextConfig;
