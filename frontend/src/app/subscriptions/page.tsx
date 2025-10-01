'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { mockSubscriptionTiers, formatDuration } from '@/lib/subscriptionData'
import { SubscriptionTierCard } from '@/components/SubscriptionTierCard'

const DURATION_OPTIONS = [
  { label: '1 Hour', seconds: BigInt(3600) },
  { label: '1 Day', seconds: BigInt(86400) },
  { label: '1 Week', seconds: BigInt(604800) },
  { label: '1 Month', seconds: BigInt(2592000) },
  { label: '3 Months', seconds: BigInt(7776000) },
]

export default function SubscriptionsPage() {
  const { isConnected } = useAccount()
  const [selectedDuration, setSelectedDuration] = useState(DURATION_OPTIONS[1]) // Default to 1 Day

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">NFT Rental Subscriptions</h1>
            <p className="text-gray-600">Please connect your wallet to view and purchase subscriptions.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">NFT Rental Subscriptions</h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose a subscription tier to unlock premium features
          </p>

          {/* Duration Selector */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Subscription Duration
            </label>
            <div className="flex flex-wrap justify-center gap-2">
              {DURATION_OPTIONS.map((option) => (
                <button
                  key={option.label}
                  onClick={() => setSelectedDuration(option)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedDuration.seconds === option.seconds
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Selected: {selectedDuration.label} ({formatDuration(selectedDuration.seconds)})
            </p>
          </div>
        </div>

        {/* Subscription Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {mockSubscriptionTiers.map((tier) => (
            <SubscriptionTierCard
              key={tier.id.toString()}
              tier={tier}
              selectedDuration={selectedDuration.seconds}
            />
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How do subscriptions work?</h3>
              <p className="text-gray-600">
                Subscriptions provide time-boxed access to premium features. You can purchase or renew
                subscriptions for specific durations, and they automatically expire when the time runs out.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I renew early?</h3>
              <p className="text-gray-600">
                Yes! If you renew before your current subscription expires, the new duration will be
                added to your remaining time, extending your access seamlessly.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What payment methods are accepted?</h3>
              <p className="text-gray-600">
                Subscriptions are paid in ETH on the Base network. We accept direct ETH payments
                through your connected wallet.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I cancel my subscription?</h3>
              <p className="text-gray-600">
                Subscriptions are time-based and cannot be cancelled once purchased. However, you can
                choose not to renew when your current subscription expires.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}