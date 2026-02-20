/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/construct-iq-360' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/construct-iq-360/' : '',
  trailingSlash: true,
}

module.exports = nextConfig
