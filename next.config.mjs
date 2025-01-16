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
    ],
  },
}

export default nextConfig