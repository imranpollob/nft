'use client'

import { useAccount } from 'wagmi'
import { useMembershipStatus } from '@/hooks/useSubscription'

export default function GatedDemoPage() {
  const { address, isConnected } = useAccount()
  const { membershipStatus: basicStatus, isLoading: basicLoading } = useMembershipStatus(
    address || '0x0000000000000000000000000000000000000000' as `0x${string}`,
    BigInt(1) // Basic tier
  )
  const { membershipStatus: proStatus, isLoading: proLoading } = useMembershipStatus(
    address || '0x0000000000000000000000000000000000000000' as `0x${string}`,
    BigInt(2) // Pro tier
  )

  if (!isConnected || !address) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Gated Content Demo</h1>
            <p className="text-gray-600">Please connect your wallet to access gated content.</p>
          </div>
        </div>
      </div>
    )
  }

  const isLoading = basicLoading || proLoading

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Gated Content Demo</h1>
          <p className="text-xl text-gray-600">
            This page demonstrates content that is locked behind subscription tiers.
          </p>
        </div>

        {/* Public Content */}
        <div className="bg-white rounded-lg shadow mb-8 p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Public Content</h2>
            <p className="text-gray-600">This content is available to everyone without a subscription.</p>
          </div>
        </div>

        {/* Basic Tier Content */}
        <div className={`rounded-lg shadow mb-8 p-8 ${basicStatus.isActive ? 'bg-white' : 'bg-gray-100'
          }`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${basicStatus.isActive ? 'bg-blue-100' : 'bg-gray-200'
                }`}>
                <span className={`text-xl ${basicStatus.isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                  B
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Basic Tier Content</h2>
                <p className="text-gray-600">Exclusive content for Basic subscribers</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${basicStatus.isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
              }`}>
              {isLoading ? 'Loading...' : basicStatus.isActive ? 'Unlocked' : 'Locked'}
            </div>
          </div>

          {basicStatus.isActive ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">🎉 Welcome to Basic Content!</h3>
                <p className="text-blue-800">
                  As a Basic subscriber, you have access to exclusive features like priority support,
                  advanced analytics, and community perks. This content is only available to paying members.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">📊 Analytics Dashboard</h4>
                  <p className="text-gray-600 text-sm">Track your rental performance with detailed analytics.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🎯 Priority Support</h4>
                  <p className="text-gray-600 text-sm">Get faster response times from our support team.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Locked</h3>
              <p className="text-gray-600 mb-4">
                Subscribe to the Basic tier to unlock this exclusive content.
              </p>
              <a
                href="/subscriptions"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Subscribe to Basic
              </a>
            </div>
          )}
        </div>

        {/* Pro Tier Content */}
        <div className={`rounded-lg shadow p-8 ${proStatus.isActive ? 'bg-white' : 'bg-gray-100'
          }`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${proStatus.isActive ? 'bg-purple-100' : 'bg-gray-200'
                }`}>
                <span className={`text-xl ${proStatus.isActive ? 'text-purple-600' : 'text-gray-400'}`}>
                  P
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Pro Tier Content</h2>
                <p className="text-gray-600">Premium content for Pro subscribers only</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${proStatus.isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
              }`}>
              {isLoading ? 'Loading...' : proStatus.isActive ? 'Unlocked' : 'Locked'}
            </div>
          </div>

          {proStatus.isActive ? (
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">🚀 Welcome to Pro Content!</h3>
                <p className="text-purple-800">
                  As a Pro subscriber, you have access to our most advanced features including
                  API access, custom integrations, and dedicated support. This is the ultimate
                  NFT rental experience.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🔧 API Access</h4>
                  <p className="text-gray-600 text-sm">Integrate rental functionality into your own applications.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🎨 Custom Integrations</h4>
                  <p className="text-gray-600 text-sm">Build custom solutions tailored to your needs.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">👨‍💼 Dedicated Support</h4>
                  <p className="text-gray-600 text-sm">Get personalized assistance from our expert team.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Content Locked</h3>
              <p className="text-gray-600 mb-4">
                Subscribe to the Pro tier to unlock our most advanced features and premium content.
              </p>
              <a
                href="/subscriptions"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium"
              >
                Subscribe to Pro
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}