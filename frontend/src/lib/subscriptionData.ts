// Mock subscription tiers data
export const mockSubscriptionTiers = [
  {
    id: BigInt(1),
    name: 'Basic',
    description: 'Access to basic features',
    pricePerSecond: BigInt('1000000000000000'), // 0.001 ETH per second
    features: [
      'Basic NFT browsing',
      'Standard support',
      'Community access',
    ],
  },
  {
    id: BigInt(2),
    name: 'Pro',
    description: 'Advanced features for power users',
    pricePerSecond: BigInt('5000000000000000'), // 0.005 ETH per second
    features: [
      'All Basic features',
      'Priority support',
      'Advanced analytics',
      'API access',
    ],
    popular: true,
  },
  {
    id: BigInt(3),
    name: 'Enterprise',
    description: 'Full access with premium support',
    pricePerSecond: BigInt('10000000000000000'), // 0.01 ETH per second
    features: [
      'All Pro features',
      'Dedicated support',
      'Custom integrations',
      'White-label options',
    ],
  },
]

export function calculateSubscriptionCost(pricePerSecond: bigint, durationSeconds: bigint): bigint {
  return pricePerSecond * durationSeconds
}

export function formatDuration(seconds: bigint): string {
  const totalSeconds = Number(seconds)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`
  return `${totalSeconds} second${totalSeconds > 1 ? 's' : ''}`
}