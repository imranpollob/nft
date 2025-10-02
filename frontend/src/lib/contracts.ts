// Contract addresses and configuration
export const CONTRACTS = {
  // Replace with actual deployed contract addresses
  RENTABLE_721: {
    base: '0x0000000000000000000000000000000000000000',
    polygon: '0x0000000000000000000000000000000000000000',
    anvil: '0x0000000000000000000000000000000000000000',
  },
  LISTING_MANAGER: {
    base: '0x0000000000000000000000000000000000000000',
    polygon: '0x0000000000000000000000000000000000000000',
    anvil: '0x0000000000000000000000000000000000000000',
  },
  RENTAL_MANAGER: {
    base: '0x0000000000000000000000000000000000000000',
    polygon: '0x0000000000000000000000000000000000000000',
    anvil: '0x0000000000000000000000000000000000000000',
  },
  ESCROW: {
    base: '0x0000000000000000000000000000000000000000',
    polygon: '0x0000000000000000000000000000000000000000',
    anvil: '0x0000000000000000000000000000000000000000',
  },
  SUB_PASS_1155: {
    base: '0x0000000000000000000000000000000000000000',
    polygon: '0x0000000000000000000000000000000000000000',
    anvil: '0x0000000000000000000000000000000000000000',
  },
} as const

export type ChainType = 'base' | 'polygon' | 'anvil'

export function getContractAddress(contract: keyof typeof CONTRACTS, chain: ChainType): string {
  // Use environment variables if available, otherwise fall back to hardcoded values
  const envKey = `NEXT_PUBLIC_${contract}_${chain.toUpperCase()}` as keyof typeof process.env
  return (process.env[envKey] as string) || CONTRACTS[contract][chain]
}

// Environment-based configuration
export const CONFIG = {
  defaultChain: (process.env.NEXT_PUBLIC_DEFAULT_CHAIN as ChainType) || 'base',
  rpcUrls: {
    base: process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org',
    polygon: process.env.NEXT_PUBLIC_POLYGON_RPC_URL || 'https://polygon-rpc.com',
  },
} as const