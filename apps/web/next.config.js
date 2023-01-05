/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  swcMinify: true,
  images: {
    domains: ["images.nvd.codes"],
    unoptimized: true,
  },
  experimental: { esmExternals: true },
  trailingSlash: true,
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/_posts/:path*",
          destination: "http://localhost:4000/_posts/:path*",
        },
      ],
    }
  },
}

module.exports = nextConfig
