/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "taytay.fishgen.org",
      },
    ],
  },
};

module.exports = nextConfig;
