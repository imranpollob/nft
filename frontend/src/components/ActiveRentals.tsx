'use client'

import { useState, useEffect } from 'react'
import { Rental } from '@/lib/types'

interface ActiveRentalsProps {
  renter: `0x${string}`
}

// Mock data for now - in a real app, this would come from an indexer or subgraph
const mockActiveRentals: Rental[] = [
  {
    id: BigInt(1),
    renter: '0x1234567890123456789012345678901234567890' as `0x${string}`,
    start: BigInt(Math.floor(Date.now() / 1000) - 3600), // 1 hour ago
    end: BigInt(Math.floor(Date.now() / 1000) + 7200), // 2 hours from now
    amount: BigInt('1000000000000000000'), // 1 ETH
    deposit: BigInt('500000000000000000'), // 0.5 ETH
    finalized: false,
    nftAddress: '0xabcdef1234567890abcdef1234567890abcdef12' as `0x${string}`,
    tokenId: BigInt(123),
  },
]

function RentalCountdown({ endTime }: { endTime: bigint }) {
  const [timeLeft, setTimeLeft] = useState<string>('')

  useEffect(() => {
    const updateCountdown = () => {
      const now = Math.floor(Date.now() / 1000)
      const end = Number(endTime)
      const diff = end - now

      if (diff <= 0) {
        setTimeLeft('Expired')
        return
      }

      const days = Math.floor(diff / 86400)
      const hours = Math.floor((diff % 86400) / 3600)
      const minutes = Math.floor((diff % 3600) / 60)
      const seconds = diff % 60

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`)
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s`)
      } else {
        setTimeLeft(`${seconds}s`)
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [endTime])

  const isExpired = timeLeft === 'Expired'

  return (
    <span className={`font-mono text-sm ${isExpired ? 'text-red-600' : 'text-green-600'}`}>
      {timeLeft}
    </span>
  )
}

export function ActiveRentals({ renter }: ActiveRentalsProps) {
  // Filter rentals for this renter
  const activeRentals = mockActiveRentals.filter(rental => rental.renter === renter)

  if (activeRentals.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-6xl mb-4">🏠</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Rentals</h3>
        <p className="text-gray-600">You don&apos;t have any active rentals at the moment.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Active Rentals ({activeRentals.length})</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {activeRentals.map((rental) => (
            <div key={rental.id.toString()} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🖼️</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      NFT #{rental.tokenId.toString()}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {rental.nftAddress.slice(0, 6)}...{rental.nftAddress.slice(-4)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">Time Remaining</div>
                  <RentalCountdown endTime={rental.end} />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Rental Cost:</span>
                  <span className="ml-2 font-medium">
                    {(Number(rental.amount) / 1e18).toFixed(4)} ETH
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Deposit:</span>
                  <span className="ml-2 font-medium">
                    {(Number(rental.deposit) / 1e18).toFixed(4)} ETH
                  </span>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                <span>Rented from: </span>
                <span className="font-mono">
                  {new Date(Number(rental.start) * 1000).toLocaleString()}
                </span>
                <span className="mx-2">to</span>
                <span className="font-mono">
                  {new Date(Number(rental.end) * 1000).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}