import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/portfolio2", // Indique à Next.js qu'il est dans un sous-dossier sur GitHub
};

export default nextConfig;
