/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_PANEL_SIFRE: process.env.NEXT_PUBLIC_PANEL_SIFRE,
  },
}

module.exports = nextConfig
