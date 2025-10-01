// Types for listing data
export interface Listing {
  id: string // `${nftAddress}-${tokenId}`
  nftAddress: `0x${string}`
  tokenId: bigint
  owner: `0x${string}`
  pricePerSecond: bigint
  minDuration: bigint
  maxDuration: bigint
  deposit: bigint
  active: boolean
  nonce: bigint
  // Additional metadata (would come from NFT contract)
  name?: string
  description?: string
  image?: string
  collection?: string
}

export interface ListingFilters {
  collection?: string
  minPrice?: bigint
  maxPrice?: bigint
  availableFrom?: Date
  availableTo?: Date
}

export interface RentalCost {
  duration: bigint
  cost: bigint
  deposit: bigint
  total: bigint
  fee: bigint
}