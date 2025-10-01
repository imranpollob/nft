'use client'

import { SubscriptionTier } from '@/lib/types'
import { useMembershipStatus } from '@/hooks/useSubscription'

interface MembershipStatusCardProps {
  tier: SubscriptionTier
  userAddress: `0x${string}`
}

export function MembershipStatusCard({ tier, userAddress }: MembershipStatusCardProps) {
  const { membershipStatus, isLoading } = useMembershipStatus(userAddress, tier.id)

  const formatExpiryDate = (timestamp: bigint) => {
    if (timestamp === BigInt(0)) return 'Never'
    const date = new Date(Number(timestamp) * 1000)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  const getTimeRemaining = (timestamp: bigint) => {
    if (timestamp === BigInt(0)) return 'N/A'
    const now = Math.floor(Date.now() / 1000)
    const expiry = Number(timestamp)
    const remaining = expiry - now

    if (remaining <= 0) return 'Expired'

    const days = Math.floor(remaining / 86400)
    const hours = Math.floor((remaining % 86400) / 3600)
    const minutes = Math.floor((remaining % 3600) / 60)

    if (days > 0) return `${days}d ${hours}h remaining`
    if (hours > 0) return `${hours}h ${minutes}m remaining`
    return `${minutes}m remaining`
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow p-6 border-2 ${membershipStatus.isActive ? 'border-green-200' : 'border-gray-200'
      }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{tier.name}</h3>
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${membershipStatus.isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
          }`}>
          {membershipStatus.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-600">Status</p>
          <p className={`text-sm font-medium ${membershipStatus.isActive ? 'text-green-600' : 'text-gray-600'
            }`}>
            {membershipStatus.isActive ? 'Active Membership' : 'No Active Membership'}
          </p>
        </div>

        {membershipStatus.isActive && (
          <div>
            <p className="text-sm text-gray-600">Time Remaining</p>
            <p className="text-sm font-medium text-gray-900">
              {getTimeRemaining(membershipStatus.activeUntil)}
            </p>
          </div>
        )}

        <div>
          <p className="text-sm text-gray-600">Expires</p>
          <p className="text-sm font-medium text-gray-900">
            {formatExpiryDate(membershipStatus.activeUntil)}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <a
          href="/subscriptions"
          className={`w-full py-2 px-4 rounded-md font-medium text-center text-sm transition-colors ${membershipStatus.isActive
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
        >
          {membershipStatus.isActive ? 'Extend Subscription' : 'Subscribe Now'}
        </a>
      </div>
    </div>
  )
}