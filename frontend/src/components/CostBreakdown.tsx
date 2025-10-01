'use client'

import { RentalCost } from '@/lib/types'

interface CostBreakdownProps {
  cost: RentalCost
  className?: string
}

export function CostBreakdown({ cost, className = '' }: CostBreakdownProps) {
  const formatEther = (value: bigint) => {
    return (Number(value) / 1e18).toFixed(4)
  }

  const total = cost.cost + cost.fee + cost.deposit

  return (
    <div className={`bg-gray-50 rounded-lg p-4 space-y-3 ${className}`}>
      <h3 className="font-semibold text-gray-900">Cost Breakdown</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Rental Cost</span>
          <span className="font-medium">{formatEther(cost.cost)} ETH</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Platform Fee</span>
          <span className="font-medium">{formatEther(cost.fee)} ETH</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Deposit</span>
          <span className="font-medium">{formatEther(cost.deposit)} ETH</span>
        </div>

        <hr className="border-gray-200" />

        <div className="flex justify-between font-semibold text-gray-900">
          <span>Total</span>
          <span>{formatEther(total)} ETH</span>
        </div>
      </div>

      <div className="text-xs text-gray-500 mt-2">
        <p>Deposit is returned when rental ends successfully.</p>
        <p>Platform fee covers transaction costs and insurance.</p>
      </div>
    </div>
  )
}