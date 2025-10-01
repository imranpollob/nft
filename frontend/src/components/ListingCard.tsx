'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Listing } from '@/lib/types'
import { PricePill } from './PricePill'
import { AvailabilityBadge } from './AvailabilityBadge'

interface ListingCardProps {
  listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
  const pricePerHour = (Number(listing.pricePerSecond) * 3600) / 1e18

  return (
    <Link
      href={`/asset/${listing.nftAddress}/${listing.tokenId}`}
      className="group block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={listing.image || '/placeholder-nft.png'}
          alt={listing.name || 'NFT'}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-2 right-2">
          <PricePill price={pricePerHour} />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-gray-900 truncate">
              {listing.name || `Token #${listing.tokenId}`}
            </h3>
            <p className="text-sm text-gray-500 truncate">
              {listing.collection}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Min: {Number(listing.minDuration) / 3600}h
          </span>
          <span className="text-gray-600">
            Max: {Number(listing.maxDuration) / 3600}h
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Deposit: {(Number(listing.deposit) / 1e18).toFixed(3)} ETH
          </span>
          <AvailabilityBadge available={listing.active} />
        </div>
      </div>
    </Link>
  )
}