'use client'

import { Rental } from '@/lib/types'

interface RentalHistoryProps {
  renter: `0x${string}`
}

// Mock data for now - in a real app, this would come from an indexer or subgraph
const mockRentalHistory: Rental[] = [
  {
    id: BigInt(2),
    renter: '0x1234567890123456789012345678901234567890' as `0x${string}`,
    start: BigInt(Math.floor(Date.now() / 1000) - 86400 * 7), // 1 week ago
    end: BigInt(Math.floor(Date.now() / 1000) - 86400 * 6), // 6 days ago
    amount: BigInt('2000000000000000000'), // 2 ETH
    deposit: BigInt('1000000000000000000'), // 1 ETH
    finalized: true,
    nftAddress: '0xabcdef1234567890abcdef1234567890abcdef12' as `0x${string}`,
    tokenId: BigInt(456),
  },
  {
    id: BigInt(3),
    renter: '0x1234567890123456789012345678901234567890' as `0x${string}`,
    start: BigInt(Math.floor(Date.now() / 1000) - 86400 * 14), // 2 weeks ago
    end: BigInt(Math.floor(Date.now() / 1000) - 86400 * 13), // 13 days ago
    amount: BigInt('500000000000000000'), // 0.5 ETH
    deposit: BigInt('250000000000000000'), // 0.25 ETH
    finalized: true,
    nftAddress: '0x1234567890abcdef1234567890abcdef12345678' as `0x${string}`,
    tokenId: BigInt(789),
  },
]

export function RentalHistory({ renter }: RentalHistoryProps) {
  // Filter rentals for this renter
  const rentalHistory = mockRentalHistory.filter(rental => rental.renter === renter)

  if (rentalHistory.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-6xl mb-4">📜</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Rental History</h3>
        <p className="text-gray-600">You haven&apos;t rented any NFTs yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Rental History ({rentalHistory.length})</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NFT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cost
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deposit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rentalHistory.map((rental) => (
              <tr key={rental.id.toString()} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-lg">🖼️</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        #{rental.tokenId.toString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {rental.nftAddress.slice(0, 6)}...{rental.nftAddress.slice(-4)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    {new Date(Number(rental.start) * 1000).toLocaleDateString()}
                  </div>
                  <div className="text-gray-500">
                    to {new Date(Number(rental.end) * 1000).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {(Number(rental.amount) / 1e18).toFixed(4)} ETH
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {(Number(rental.deposit) / 1e18).toFixed(4)} ETH
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${rental.finalized
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {rental.finalized ? 'Completed' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <a
                    href={`https://basescan.org/tx/0x${rental.id.toString(16).padStart(64, '0')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View TX
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}