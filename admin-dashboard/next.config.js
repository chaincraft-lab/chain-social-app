const withImages = require('next-images');

const redirects = {
  async redirects() {
    return [];
  },
  swcMinify: false,
  reactStrictMode: false
};

module.exports = withImages(redirects);
