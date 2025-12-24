/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        // Optional: port: '', (default is fine)
        pathname: '**',  // Allows any path under this domain
      },
    ],
  },
  reactCompiler: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ['lh3.googleusercontent.com'],
//   },
//   reactCompiler: true,
  
//   // Add this section to fix COOP issues
//   async headers() {
//     return [
//       {
//         source: '/:path*', // Apply to all routes
//         headers: [
//           {
//             key: 'Cross-Origin-Opener-Policy',
//             value: 'same-origin-allow-popups',
//           },
//           {
//             key: 'Cross-Origin-Embedder-Policy',
//             value: 'unsafe-none',
//           },
//         ],
//       },
//     ];
//   },
// };

// export default nextConfig;