const webpack = require("webpack");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "*.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
    ],
  },

     webpack(config, { isServer }) {
       if (!isServer) {
         config.resolve.fallback = {
           ...config.resolve.fallback,
           fs: false,
           net: false,
           tls: false,
         };
         config.plugins.push(
           new webpack.ProvidePlugin({ Buffer: ["buffer", "Buffer"] })
         );
       }
       return config;
     },

     async redirects() {
       return [
         {
           source: "/:path*(/)",
           has: [
             {
               type: "query",
               key: "path",
               value: "(.*)/",
             },
           ],
           destination: "/:path*",
           permanent: true,
         },
         {
           source: "/:path*(/)",
           has: [
             {
               type: "query",
               key: "path",
               value: "(.*[^/])",
             },
           ],
           destination: "/:path*",
           permanent: true,
         },
       ];
     },
};

module.exports = nextConfig;
