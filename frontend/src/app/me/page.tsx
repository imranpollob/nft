'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { ActiveRentals } from '@/components/ActiveRentals'
import { RentalHistory } from '@/components/RentalHistory'

type Tab = 'active' | 'history'

export default function MePage() {
  const { address, isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<Tab>('active')

  if (!isConnected || !address) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">My Rentals</h1>
            <p className="text-gray-600">Please connect your wallet to view your rentals.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Rentals</h1>
          <p className="text-gray-600">Manage your active rentals and view rental history.</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('active')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'active'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Active Rentals
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Rental History
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'active' && <ActiveRentals renter={address} />}
          {activeTab === 'history' && <RentalHistory renter={address} />}
        </div>
      </div>
    </div>
  )
}