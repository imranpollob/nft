'use client'

import { useMemo } from 'react'
import { mockListings, getUniqueCollections, filterListings } from '@/lib/mockData'
import { ListingFilters } from '@/lib/types'

export function useListings(filters?: ListingFilters) {
  const listings = useMemo(() => {
    if (!filters) return mockListings
    return filterListings(mockListings, filters)
  }, [filters])

  const collections = useMemo(() => getUniqueCollections(mockListings), [])

  return {
    listings,
    collections,
    isLoading: false,
    error: null,
  }
}

export function useListing(nftAddress: string, tokenId: string) {
  const listing = useMemo(() => {
    return mockListings.find(
      (l) => l.nftAddress === nftAddress && l.tokenId.toString() === tokenId
    )
  }, [nftAddress, tokenId])

  return {
    listing,
    isLoading: false,
    error: null,
  }
}

export function useFeaturedListings(limit = 4) {
  const listings = useMemo(() => {
    return mockListings.slice(0, limit)
  }, [limit])

  return {
    listings,
    isLoading: false,
    error: null,
  }
}