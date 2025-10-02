import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // IPFS gateways
      {
        protocol: 'https',
        hostname: 'ipfs.io',
        port: '',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: '*.ipfs.dweb.link',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
        port: '',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: 'cloudflare-ipfs.com',
        port: '',
        pathname: '/ipfs/**',
      },
      // NFT marketplaces and common sources
      {
        protocol: 'https',
        hostname: 'opensea.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.opensea.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'rarible.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.rarible.com',
        port: '',
        pathname: '/**',
      },
      // Allow all HTTPS domains for maximum NFT compatibility
      // Note: This is less secure but necessary for dynamic NFT sources
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
