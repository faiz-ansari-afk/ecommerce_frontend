/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development'
  // register: true,
  // skipWaiting: true,
  // sw: 'service-worker.js',
  // disable: process.env.NODE_ENV === 'development',
  // register: true,
  // scope: '/app',
  // sw: 'service-worker.js',
  //...
});

module.exports = withPWA({
  // next.js config
  reactStrictMode: true,
  images: {
    domains: [
      'storage.googleapis.com',
      'res.cloudinary.com',
      'ijazatback.onrender.com',
    ],
  },
});
