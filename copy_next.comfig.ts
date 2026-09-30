import type { NextConfig } from 'next';

const backendUrl =
  process.env.BACKEND_URL ||
  'http://localhost:8080';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
};
export default nextConfig;


// ====ini develop ===

// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
//   async rewrites() {
//     return [
//       {
//         source: '/api/v1/:path*',
//         destination:
//           'http://202.59.201.251:8080/api/v1/:path*',
//         },
//     ];
//   },
// };

// export default nextConfig;