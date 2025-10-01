'use client'

import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { base, polygon } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'NFT Rental Marketplace',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
  chains: [base, polygon],
  ssr: true,
})