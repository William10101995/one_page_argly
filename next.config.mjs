/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/v1/:path*",
        destination: "https://api.argly.com.ar/v1/:path*",
      },
      {
        source: "/api/admin/:path*",
        destination: "https://api.argly.com.ar/api/admin/:path*",
      },
    ]
  },
}

export default nextConfig
