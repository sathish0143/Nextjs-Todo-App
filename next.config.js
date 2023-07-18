/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "export",
  experimental: {
    externalDir:
      true |
      {
        enabled: true,
        silent: true,
      },
  },
};

module.exports = nextConfig;
