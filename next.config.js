/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['@libsql/client'],
  },
}

module.exports = nextConfig
