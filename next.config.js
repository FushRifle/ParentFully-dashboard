/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  // Vercel's smaller build workers can need longer to analyse the legacy
  // dashboard bundles. Avoid killing and restarting an otherwise healthy
  // page-data worker at Next 12's 60-second default.
  staticPageGenerationTimeout: 180,
  experimental: {
    // A single worker prevents the large NextUI pages from competing for the
    // same memory/CPU allocation during page-data collection.
    cpus: 1,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
