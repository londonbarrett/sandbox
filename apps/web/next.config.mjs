/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui", "react-tradekit"],
  serverExternalPackages: ["ccxt"],
}

export default nextConfig
