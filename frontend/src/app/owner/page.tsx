'use client'

import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useListings } from '@/hooks/useListings'
import { ListingCard } from '@/components/ListingCard'
import Link from 'next/link'

export default function OwnerDashboard() {
  const { address } = useAccount()
  const { listings, isLoading } = useListings()

  const ownerListings = useMemo(() => {
    if (!address) return []
    return listings.filter(listing => listing.owner.toLowerCase() === address.toLowerCase())
  }, [listings, address])

  const activeListings = ownerListings.filter(listing => listing.active)
  const inactiveListings = ownerListings.filter(listing => !listing.active)

  const totalEarnings = useMemo(() => {
    // Mock calculation - in real app this would come from contract events
    return activeListings.length * 0.5 // Mock earnings
  }, [activeListings])

  if (!address) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">Please connect your wallet to view your dashboard.</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Owner Dashboard</h1>
          <p className="text-gray-600">Manage your NFT listings and track earnings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Listings</h3>
            <p className="text-3xl font-bold text-gray-900">{activeListings.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Listings</h3>
            <p className="text-3xl font-bold text-gray-900">{ownerListings.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
            <p className="text-3xl font-bold text-gray-900">{totalEarnings.toFixed(2)} ETH</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <Link
              href="/owner/new"
              className="inline-block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Create Listing
            </Link>
          </div>
        </div>

        {/* Active Listings */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Active Listings</h2>
            <Link
              href="/listings"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Listings →
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your listings...</p>
            </div>
          ) : activeListings.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600 mb-4">You don&apos;t have any active listings yet.</p>
              <Link
                href="/owner/new"
                className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Your First Listing
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeListings.map((listing) => (
                <div key={listing.id} className="relative">
                  <ListingCard listing={listing} />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <Link
                      href={`/owner/${listing.id}`}
                      className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-white transition-colors"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inactive Listings */}
        {inactiveListings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Inactive Listings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inactiveListings.map((listing) => (
                <div key={listing.id} className="relative opacity-60">
                  <ListingCard listing={listing} />
                  <div className="absolute inset-0 bg-gray-900/20 rounded-lg flex items-center justify-center">
                    <span className="bg-white px-3 py-1 rounded-md text-sm font-medium text-gray-700">
                      Inactive
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Link
                      href={`/owner/${listing.id}`}
                      className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-white transition-colors"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/owner/new"
              className="flex items-center justify-center bg-blue-50 text-blue-700 py-4 px-6 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">➕</div>
                <div className="font-medium">Create Listing</div>
              </div>
            </Link>

            <Link
              href="/listings"
              className="flex items-center justify-center bg-green-50 text-green-700 py-4 px-6 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">📊</div>
                <div className="font-medium">View Analytics</div>
              </div>
            </Link>

            <div className="flex items-center justify-center bg-purple-50 text-purple-700 py-4 px-6 rounded-lg cursor-not-allowed opacity-50">
              <div className="text-center">
                <div className="text-2xl mb-2">💰</div>
                <div className="font-medium">Withdraw Earnings</div>
                <div className="text-xs mt-1">Coming Soon</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}