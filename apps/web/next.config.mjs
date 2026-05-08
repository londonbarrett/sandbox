/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  experimental: {
    serverComponentsExternalPackages: ["ccxt"],
  },
}

export default nextConfig
