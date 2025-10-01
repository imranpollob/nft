'use client'

import { useState } from 'react'
import { useListings } from '@/hooks/useListings'
import { ListingCard } from '@/components/ListingCard'
import { ListingFilters } from '@/lib/types'

export default function ListingsPage() {
  const [filters, setFilters] = useState<ListingFilters>({})
  const { listings, isLoading, error } = useListings(filters)

  const handleFilterChange = (newFilters: Partial<ListingFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading listings...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-red-600">Error loading listings</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Listings</h1>
          <p className="text-gray-600">Discover and rent unique NFTs from our curated collection</p>
        </div>

        {/* Filters - TODO: Add filter UI components */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Collection filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection
                </label>
                <select
                  value={filters.collection || ''}
                  onChange={(e) => handleFilterChange({ collection: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Collections</option>
                  <option value="Bored Ape Yacht Club">Bored Ape Yacht Club</option>
                  <option value="CryptoPunks">CryptoPunks</option>
                  <option value="Azuki">Azuki</option>
                </select>
              </div>

              {/* Price range filters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price (ETH/hour)
                </label>
                <input
                  type="number"
                  step="0.001"
                  placeholder="0.001"
                  value={filters.minPrice ? Number(filters.minPrice) / 1e18 : ''}
                  onChange={(e) => handleFilterChange({
                    minPrice: e.target.value ? BigInt(Math.floor(Number(e.target.value) * 1e18)) : undefined
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price (ETH/hour)
                </label>
                <input
                  type="number"
                  step="0.001"
                  placeholder="1.0"
                  value={filters.maxPrice ? Number(filters.maxPrice) / 1e18 : ''}
                  onChange={(e) => handleFilterChange({
                    maxPrice: e.target.value ? BigInt(Math.floor(Number(e.target.value) * 1e18)) : undefined
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Clear filters */}
              <div className="flex items-end">
                <button
                  onClick={() => setFilters({})}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            {listings.length} listing{listings.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Listings Grid */}
        {listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No listings found matching your criteria.</p>
            <button
              onClick={() => setFilters({})}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}