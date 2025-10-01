'use client'

import Link from 'next/link'
import { useFeaturedListings } from '@/hooks/useListings'
import { ListingCard } from '@/components/ListingCard'

export default function Home() {
  const { listings: featuredListings, isLoading } = useFeaturedListings(4)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Rent Unique NFTs
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Discover, rent, and experience exclusive digital assets from top collections
            </p>
            <div className="space-x-4">
              <Link
                href="/listings"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Browse Listings
              </Link>
              <button className="inline-block bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors">
                List Your NFT
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Listings</h2>
          <p className="text-gray-600 text-lg">
            Handpicked NFTs available for rent right now
          </p>
        </div>

        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading featured listings...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        <div className="text-center">
          <Link
            href="/listings"
            className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            View All Listings
          </Link>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 text-lg">
              Renting NFTs has never been easier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse & Discover</h3>
              <p className="text-gray-600">
                Explore our curated collection of NFTs from top collections, filter by price and availability.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Set Rental Period</h3>
              <p className="text-gray-600">
                Choose your rental duration and see live cost calculations with transparent pricing.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Rent Instantly</h3>
              <p className="text-gray-600">
                Complete the transaction with your wallet and start enjoying your rented NFT immediately.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">1,234</div>
              <div className="text-gray-400">Active Listings</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">5,678</div>
              <div className="text-gray-400">Successful Rentals</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">12.5K</div>
              <div className="text-gray-400">ETH Volume</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
