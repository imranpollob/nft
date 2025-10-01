import { Listing, ListingFilters } from './types'

// Mock listings data for development
export const mockListings: Listing[] = [
  {
    id: '0x1234567890123456789012345678901234567890-1',
    nftAddress: '0x1234567890123456789012345678901234567890',
    tokenId: BigInt(1),
    owner: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    pricePerSecond: BigInt('1000000000000'), // 0.001 ETH per second
    minDuration: BigInt(3600), // 1 hour
    maxDuration: BigInt(86400), // 24 hours
    deposit: BigInt('100000000000000000'), // 0.1 ETH
    active: true,
    nonce: BigInt(1),
    name: 'Cosmic Ape #1',
    description: 'A rare cosmic ape from the depths of the metaverse',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkNvc21pYyBBcGUgIzE8L3RleHQ+PC9zdmc+',
    collection: 'Cosmic Apes',
  },
  {
    id: '0x1234567890123456789012345678901234567890-2',
    nftAddress: '0x1234567890123456789012345678901234567890',
    tokenId: BigInt(2),
    owner: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    pricePerSecond: BigInt('2000000000000'), // 0.002 ETH per second
    minDuration: BigInt(1800), // 30 minutes
    maxDuration: BigInt(43200), // 12 hours
    deposit: BigInt('50000000000000000'), // 0.05 ETH
    active: true,
    nonce: BigInt(1),
    name: 'Digital Dragon #2',
    description: 'A majestic digital dragon with fiery breath',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzY2NkZGRiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkRpZ2l0YWwgRHJhZ29uICMyPC90ZXh0Pjwvc3ZnPg==',
    collection: 'Digital Dragons',
  },
  {
    id: '0x9876543210987654321098765432109876543210-1',
    nftAddress: '0x9876543210987654321098765432109876543210',
    tokenId: BigInt(1),
    owner: '0xfedcba0987654321fedcba0987654321fedcba0987',
    pricePerSecond: BigInt('500000000000'), // 0.0005 ETH per second
    minDuration: BigInt(7200), // 2 hours
    maxDuration: BigInt(172800), // 48 hours
    deposit: BigInt('200000000000000000'), // 0.2 ETH
    active: true,
    nonce: BigInt(1),
    name: 'Pixel Punk #1',
    description: 'A retro pixel art punk from the 80s revival',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzMzNjY5OSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPlBpeGVsIFB1bmsgIzE8L3RleHQ+PC9zdmc+',
    collection: 'Pixel Punks',
  },
  {
    id: '0x9876543210987654321098765432109876543210-2',
    nftAddress: '0x9876543210987654321098765432109876543210',
    tokenId: BigInt(2),
    owner: '0xfedcba0987654321fedcba0987654321fedcba0987',
    pricePerSecond: BigInt('1500000000000'), // 0.0015 ETH per second
    minDuration: BigInt(3600), // 1 hour
    maxDuration: BigInt(86400), // 24 hours
    deposit: BigInt('100000000000000000'), // 0.1 ETH
    active: true,
    nonce: BigInt(1),
    name: 'Neon Cat #2',
    description: 'A glowing neon cat that lights up the night',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPk5lb24gQ2F0ICMyPC90ZXh0Pjwvc3ZnPg==',
    collection: 'Neon Cats',
  },
]

export const getUniqueCollections = (listings: Listing[]): string[] => {
  const collections = new Set(listings.map(listing => listing.collection).filter((c): c is string => Boolean(c)))
  return Array.from(collections)
}

export const filterListings = (listings: Listing[], filters: ListingFilters): Listing[] => {
  return listings.filter(listing => {
    if (filters.collection && listing.collection !== filters.collection) return false
    if (filters.minPrice && listing.pricePerSecond < filters.minPrice) return false
    if (filters.maxPrice && listing.pricePerSecond > filters.maxPrice) return false
    return true
  })
}