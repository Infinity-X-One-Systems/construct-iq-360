/** @type {import('next').NextConfig} */
const BASE_PATH = process.env.NODE_ENV === 'production' ? '/construct-iq-360' : '';

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: BASE_PATH,
  assetPrefix: BASE_PATH ? `${BASE_PATH}/` : '',
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
  },
}

module.exports = nextConfig
