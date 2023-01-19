/** @type {import('next').NextConfig} */
const nextConfig = {
<<<<<<< HEAD
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  // assetPrefix: process.env.NEXT_PUBLIC_PREFIX_URL || '',
  basePath: process.env.NEXT_PUBLIC_PREFIX_URL || '',
  publicRuntimeConfig: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ||
      'https://api-corp-hc-services.bumame.com'
  }
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: process.env.NEXT_PUBLIC_PREFIX_URL || '',
  //       basePath: false,
  //       permanent: false
  //     }
  //   ];
  // }
};

module.exports = nextConfig;
=======
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
>>>>>>> cf2c543623abdfb04966cde688e14d33f22e63d3
