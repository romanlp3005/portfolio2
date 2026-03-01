import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Indique à Next.js de générer des fichiers statiques
  images: {
    unoptimized: true, // Requis si vous utilisez le composant <Image /> de Next.js
  },
};

export default nextConfig;