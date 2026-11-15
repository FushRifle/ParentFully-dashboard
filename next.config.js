/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  staticPageGenerationTimeout: 180,
  experimental: {
    cpus: 1,
    useTypeScriptCli: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig