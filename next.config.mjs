/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
    typescript: {
        ignoreBuildErrors: true,
      },
};

export default nextConfig;
