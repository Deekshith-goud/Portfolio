/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
      { hostname: "icons.duckduckgo.com" },
      { hostname: "res.cloudinary.com" },
      { hostname: "www.google.com" },
      { hostname: "images.unsplash.com" },
    ],
  },
  modularizeImports: {
    "react-icons/?((?:[a-zA-Z0-9]+)*)": {
      transform: "react-icons/{{ matches.[1] }}/{{member}}",
      skipDefaultConversion: true,
    },
  },
};
