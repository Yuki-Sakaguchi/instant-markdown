const pkg = require("./package.json");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    VERSION: pkg.version,
  },
};

module.exports = nextConfig;
