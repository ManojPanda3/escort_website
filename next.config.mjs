/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-67835d24e9f64bd281a751b37995b9d9.r2.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placewaifu.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    // Disables ESLint during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignores TypeScript errors during builds
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
