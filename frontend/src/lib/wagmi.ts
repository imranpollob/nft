'use client'

import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { base, polygon } from 'wagmi/chains'

const anvil = {
  id: 31337,
  name: 'Anvil',
  network: 'anvil',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] },
  },
  blockExplorers: {
    default: { name: 'Anvil', url: 'http://127.0.0.1:8545' },
  },
  testnet: true,
}

export const config = getDefaultConfig({
  appName: 'NFT Rental Marketplace',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
  chains: [base, polygon, anvil],
  ssr: true,
})