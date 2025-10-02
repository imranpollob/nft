'use client'

import { useMemo } from 'react'
import { useReadContracts, useContractRead } from 'wagmi'
import { mockListings, getUniqueCollections, filterListings } from '@/lib/mockData'
import { ListingFilters } from '@/lib/types'
import { LISTING_MANAGER_ABI, RENTABLE_721_ABI } from '@/lib/abis'
import { getContractAddress } from '@/lib/contracts'
import { useChainId } from 'wagmi'
import { base, polygon } from 'wagmi/chains'

// Known demo tokenIds that were minted
const DEMO_TOKEN_IDS = [BigInt(1), BigInt(2), BigInt(3), BigInt(4)]

type ContractListingResult = {
  owner: string
  pricePerSecond: bigint
  minDuration: bigint
  maxDuration: bigint
  deposit: bigint
  availabilityHash: string
  active: boolean
  nonce: bigint
}

type MetadataResult = [string, string, string, string]

export function useListings(filters?: ListingFilters) {
  const chainId = useChainId()
  const chain = chainId === base.id ? 'base' : chainId === polygon.id ? 'polygon' : chainId === 31337 ? 'anvil' : 'base'

  let rentable721Address: string
  let listingManagerAddress: string

  if (chain === 'anvil') {
    rentable721Address = process.env.NEXT_PUBLIC_RENTABLE_721_ANVIL || '0x0000000000000000000000000000000000000000'
    listingManagerAddress = process.env.NEXT_PUBLIC_LISTING_MANAGER_ANVIL || '0x0000000000000000000000000000000000000000'
  } else if (chain === 'base') {
    rentable721Address = process.env.NEXT_PUBLIC_RENTABLE_721_BASE || '0x0000000000000000000000000000000000000000'
    listingManagerAddress = process.env.NEXT_PUBLIC_LISTING_MANAGER_BASE || '0x0000000000000000000000000000000000000000'
  } else if (chain === 'polygon') {
    rentable721Address = process.env.NEXT_PUBLIC_RENTABLE_721_POLYGON || '0x0000000000000000000000000000000000000000'
    listingManagerAddress = process.env.NEXT_PUBLIC_LISTING_MANAGER_POLYGON || '0x0000000000000000000000000000000000000000'
  } else {
    rentable721Address = '0x0000000000000000000000000000000000000000'
    listingManagerAddress = '0x0000000000000000000000000000000000000000'
  }
  console.log('useListings: listingManagerAddress =', listingManagerAddress)

    // Memoize contract configurations to prevent recreation on every render
  const listingContracts = useMemo(() => DEMO_TOKEN_IDS.map(tokenId => ({
    address: listingManagerAddress as `0x${string}`,
    abi: LISTING_MANAGER_ABI,
    functionName: 'getListing',
    args: [rentable721Address as `0x${string}`, tokenId],
  })), [listingManagerAddress, rentable721Address])

  const metadataContracts = useMemo(() => DEMO_TOKEN_IDS.map(tokenId => ({
    address: rentable721Address as `0x${string}`,
    abi: RENTABLE_721_ABI,
    functionName: 'getTokenMetadata',
    args: [tokenId],
  })), [rentable721Address])

  const { data: listingsData, isLoading: listingsLoading, error: listingsError } = useReadContracts({
    contracts: listingContracts,
  })

  const { data: metadataData, isLoading: metadataLoading, error: metadataError } = useReadContracts({
    contracts: metadataContracts,
  })

  const listings = useMemo(() => {
    if (!listingsData || !metadataData) {
      return mockListings // Fallback to mock data
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const realListings = (listingsData as any[])
      .map((result, index) => {
        if (result.status !== 'success' || !result.result) {
          return null
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const metadataResult = (metadataData as any[])[index]
        if (!metadataResult || metadataResult.status !== 'success' || !metadataResult.result) {
          return null
        }

        const contractListing = result.result as ContractListingResult
        const metadata = metadataResult.result as MetadataResult
        const tokenId = DEMO_TOKEN_IDS[index]

        // Only return active listings
        if (!contractListing.active) {
          console.log('useListings: listing not active for token', tokenId)
          return null
        }

        const listing = {
          id: `${rentable721Address}-${tokenId}`,
          nftAddress: rentable721Address as `0x${string}`,
          tokenId,
          owner: contractListing.owner as `0x${string}`,
          pricePerSecond: contractListing.pricePerSecond,
          minDuration: contractListing.minDuration,
          maxDuration: contractListing.maxDuration,
          deposit: contractListing.deposit,
          active: contractListing.active,
          nonce: contractListing.nonce,
          name: metadata[0] || `NFT #${tokenId}`,
          description: metadata[1] || 'A unique NFT available for rent',
          image: metadata[2] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzk5OSI+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ORlQgI3tva2VuSWR9PC90ZXh0Pjwvc3ZnPg==',
          collection: metadata[3] || 'Rentable NFTs',
        }

        console.log('useListings: created listing =', listing)
        return listing
      })
      .filter((listing): listing is NonNullable<typeof listing> => {
        const keep = listing !== null
        console.log('useListings: filtering listing, keep =', keep, listing)
        return keep
      })

    console.log('useListings: realListings =', realListings)

    // If we have real listings, use them; otherwise fall back to filtered mock data
    const finalListings = realListings.length > 0 ? realListings : mockListings

    console.log('useListings: finalListings =', finalListings)

    if (!filters) return finalListings
    return filterListings(finalListings, filters)
  }, [listingsData, metadataData, filters, rentable721Address])

  const collections = useMemo(() => getUniqueCollections(listings), [listings])

  return {
    listings,
    collections,
    isLoading: listingsLoading || metadataLoading,
    error: listingsError || metadataError,
  }
}

export function useListing(nftAddress: string, tokenId: string) {
  const chainId = useChainId()
  const chain = chainId === base.id ? 'base' : chainId === polygon.id ? 'polygon' : chainId === 31337 ? 'anvil' : 'base'

  let rentable721Address: string
  let listingManagerAddress: string

  if (chain === 'anvil') {
    rentable721Address = process.env.NEXT_PUBLIC_RENTABLE_721_ANVIL || '0x0000000000000000000000000000000000000000'
    listingManagerAddress = process.env.NEXT_PUBLIC_LISTING_MANAGER_ANVIL || '0x0000000000000000000000000000000000000000'
  } else if (chain === 'base') {
    rentable721Address = process.env.NEXT_PUBLIC_RENTABLE_721_BASE || '0x0000000000000000000000000000000000000000'
    listingManagerAddress = process.env.NEXT_PUBLIC_LISTING_MANAGER_BASE || '0x0000000000000000000000000000000000000000'
  } else if (chain === 'polygon') {
    rentable721Address = process.env.NEXT_PUBLIC_RENTABLE_721_POLYGON || '0x0000000000000000000000000000000000000000'
    listingManagerAddress = process.env.NEXT_PUBLIC_LISTING_MANAGER_POLYGON || '0x0000000000000000000000000000000000000000'
  } else {
    rentable721Address = '0x0000000000000000000000000000000000000000'
    listingManagerAddress = '0x0000000000000000000000000000000000000000'
  }

  const tokenIdBigInt = BigInt(tokenId)

  const { data: listingData, isLoading: listingLoading, error: listingError } = useContractRead({
    address: listingManagerAddress as `0x${string}`,
    abi: LISTING_MANAGER_ABI,
    functionName: 'getListing',
    args: [nftAddress as `0x${string}`, tokenIdBigInt],
  })

  const { data: metadataData, isLoading: metadataLoading, error: metadataError } = useContractRead({
    address: rentable721Address as `0x${string}`,
    abi: RENTABLE_721_ABI,
    functionName: 'getTokenMetadata',
    args: [tokenIdBigInt],
  })

  const listing = useMemo(() => {
    if (!listingData || !metadataData) {
      // Fallback to mock data if no real data
      return mockListings.find(
        (l) => l.nftAddress === nftAddress && l.tokenId.toString() === tokenId
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contractListing = listingData as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const metadata = metadataData as any

    if (!contractListing.active) {
      return null
    }

    return {
      id: `${nftAddress}-${tokenId}`,
      nftAddress: nftAddress as `0x${string}`,
      tokenId: tokenIdBigInt,
      owner: contractListing.owner as `0x${string}`,
      pricePerSecond: contractListing.pricePerSecond,
      minDuration: contractListing.minDuration,
      maxDuration: contractListing.maxDuration,
      deposit: contractListing.deposit,
      active: contractListing.active,
      nonce: contractListing.nonce,
      name: metadata[0] || `NFT #${tokenId}`,
      description: metadata[1] || 'A unique NFT available for rent',
      image: metadata[2] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzk5OSI+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ORlQgI3tva2VuSWR9PC90ZXh0Pjwvc3ZnPg==',
      collection: metadata[3] || 'Rentable NFTs',
    }
  }, [listingData, metadataData, nftAddress, tokenIdBigInt])

  return {
    listing,
    isLoading: listingLoading || metadataLoading,
    error: listingError || metadataError,
  }
}

export function useFeaturedListings(limit = 4) {
  const { listings, isLoading, error } = useListings()

  const featuredListings = useMemo(() => {
    return listings.slice(0, limit)
  }, [listings, limit])

  return {
    listings: featuredListings,
    isLoading,
    error,
  }
}