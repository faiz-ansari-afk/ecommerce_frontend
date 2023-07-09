/** @type {import('next').NextConfig} */

const dotenv = require('dotenv');
const webpack = require('webpack');

dotenv.config();

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  // sw: 'custom-sw.js',
  // register: false
  // skipWaiting: true,
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
  webpack: (config) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        '{{NEXT_PUBLIC_FIREBASE_API_KEY}}': JSON.stringify(
          process.env.NEXT_PUBLIC_FIREBASE_API_KEY
        ),
        '{{NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}}': JSON.stringify(
          process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
        ),
        '{{NEXT_PUBLIC_FIREBASE_PROJECT_ID}}': JSON.stringify(
          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
        ),
        '{{NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}}': JSON.stringify(
          process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
        ),
        '{{NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}}': JSON.stringify(
          process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
        ),
        '{{NEXT_PUBLIC_FIREBASE_APP_ID}}': JSON.stringify(
          process.env.NEXT_PUBLIC_FIREBASE_APP_ID
        ),
        '{{NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}}': JSON.stringify(
          process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
        ),
      })
    );

    return config;
  },
});
