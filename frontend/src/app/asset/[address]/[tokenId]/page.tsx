'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useListing } from '@/hooks/useListings'
import { DateTimeRangePicker } from '@/components/DateTimeRangePicker'
import { CostBreakdown } from '@/components/CostBreakdown'
import { AvailabilityBadge } from '@/components/AvailabilityBadge'
import { PricePill } from '@/components/PricePill'
import { RentalCost } from '@/lib/types'

export default function AssetPage() {
  const params = useParams()
  const nftAddress = params.address as string
  const tokenId = params.tokenId as string

  const { listing, isLoading, error } = useListing(nftAddress, tokenId)

  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date(Date.now() + 3600000)) // 1 hour from now

  // Mock rental cost calculation - in real app this would come from contract
  const calculateRentalCost = (): RentalCost => {
    if (!listing) return { duration: BigInt(0), cost: BigInt(0), deposit: BigInt(0), total: BigInt(0), fee: BigInt(0) }

    const duration = BigInt(Math.floor((endDate.getTime() - startDate.getTime()) / 1000))
    const cost = listing.pricePerSecond * duration
    const fee = cost / BigInt(20) // 5% fee
    const deposit = listing.deposit

    return {
      duration,
      cost,
      deposit,
      total: cost + fee + deposit,
      fee,
    }
  }

  const rentalCost = calculateRentalCost()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-center text-gray-600">Loading asset...</p>
        </div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-red-600">Asset not found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Asset Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
              {listing.image ? (
                <img
                  src={listing.image}
                  alt={listing.name || `NFT ${listing.tokenId}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-6xl">🖼️</span>
                </div>
              )}
            </div>

            {/* Asset Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {listing.name || `NFT #${listing.tokenId}`}
              </h1>
              <p className="text-gray-600 mb-4">
                {listing.collection || 'Unknown Collection'}
              </p>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Token ID</span>
                  <span className="font-mono text-sm">{listing.tokenId.toString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Contract</span>
                  <span className="font-mono text-sm">{listing.nftAddress}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Owner</span>
                  <span className="font-mono text-sm">{listing.owner}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <AvailabilityBadge available={listing.active} />
                </div>
              </div>
            </div>
          </div>

          {/* Rental Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Rent this NFT</h2>

              <div className="space-y-4">
                <PricePill
                  price={Number(listing.pricePerSecond) / 1e18}
                />

                <DateTimeRangePicker
                  startDate={startDate}
                  endDate={endDate}
                  onStartChange={setStartDate}
                  onEndChange={setEndDate}
                  minDuration={Number(listing.minDuration)}
                  maxDuration={Number(listing.maxDuration)}
                />

                <CostBreakdown cost={rentalCost} />

                <button
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!listing.active}
                >
                  {listing.active ? 'Rent Now' : 'Not Available'}
                </button>
              </div>
            </div>

            {/* Description */}
            {listing.description && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-700">{listing.description}</p>
              </div>
            )}

            {/* Terms */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-3">Rental Terms</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• NFT remains in your wallet during rental period</li>
                <li>• Deposit is returned when rental ends successfully</li>
                <li>• Platform fee covers transaction costs and insurance</li>
                <li>• Rental can be ended early by either party</li>
                <li>• Owner receives payment immediately upon rental start</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}