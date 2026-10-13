/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // Le immagini sono servite dal CDN di Sanity (ridimensionate e convertite
    // in WebP/AVIF lì), così non si consuma la quota di ottimizzazione
    // immagini del piano gratuito di Vercel. Vedi src/components/SanityImage.tsx
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  async redirects() {
    // vecchi link ai filtri (/store?categoria=x) → pagine categoria vere
    return [{ source: "/store", has: [{ type: "query", key: "categoria", value: "(?<cat>[a-z0-9-]+)" }], destination: "/store/:cat", permanent: true }];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};
export default nextConfig;
