'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { SubscriptionTier } from '@/lib/types'
import { calculateSubscriptionCost } from '@/lib/subscriptionData'
import { useBuyOrRenew } from '@/hooks/useSubscription'
import { TxDialog, TxStatus } from '@/components/TxDialog'

interface SubscriptionTierCardProps {
  tier: SubscriptionTier
  selectedDuration: bigint
}

export function SubscriptionTierCard({ tier, selectedDuration }: SubscriptionTierCardProps) {
  const { address } = useAccount()
  const { buyOrRenew, isProcessing } = useBuyOrRenew()
  const [txStatus, setTxStatus] = useState<TxStatus>('idle')
  const [txHash, setTxHash] = useState<string>()
  const [error, setError] = useState<string>()

  const cost = calculateSubscriptionCost(tier.pricePerSecond, selectedDuration)
  const costInEth = Number(cost) / 1e18

  const handlePurchase = async () => {
    if (!address) {
      setError('Please connect your wallet')
      setTxStatus('error')
      return
    }

    setTxStatus('pending')
    setError(undefined)

    try {
      // Note: In a real implementation, this would be a payable transaction
      // For now, this is a placeholder that calls the contract owner's mintOrRenew function
      const hash = await buyOrRenew({
        tierId: tier.id,
        seconds: selectedDuration,
      })

      setTxHash(hash)
      setTxStatus('success')
    } catch (err: unknown) {
      console.error('Purchase error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to purchase subscription'
      setError(errorMessage)
      setTxStatus('error')
    }
  }

  const handleRetry = () => {
    handlePurchase()
  }

  const handleClose = () => {
    setTxStatus('idle')
    setTxHash(undefined)
    setError(undefined)
  }

  return (
    <>
      <div className={`bg-white rounded-lg shadow-lg overflow-hidden border-2 ${tier.popular ? 'border-blue-500 relative' : 'border-gray-200'
        }`}>
        {tier.popular && (
          <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-sm font-medium rounded-bl-lg">
            Most Popular
          </div>
        )}

        <div className="p-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
            <p className="text-gray-600 mb-6">{tier.description}</p>

            <div className="mb-6">
              <div className="text-3xl font-bold text-gray-900">
                {costInEth.toFixed(4)} ETH
              </div>
              <div className="text-sm text-gray-500">
                ≈ ${(costInEth * 2500).toFixed(2)} USD
              </div>
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            {tier.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={handlePurchase}
            disabled={isProcessing}
            className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${tier.popular
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-900 text-white hover:bg-gray-800'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isProcessing ? 'Processing...' : `Subscribe to ${tier.name}`}
          </button>
        </div>
      </div>

      <TxDialog
        isOpen={txStatus !== 'idle'}
        status={txStatus}
        title={
          txStatus === 'pending'
            ? 'Purchasing Subscription'
            : txStatus === 'success'
              ? 'Subscription Purchased!'
              : 'Purchase Failed'
        }
        message={
          txStatus === 'pending'
            ? 'Confirming your subscription purchase...'
            : txStatus === 'success'
              ? `Your ${tier.name} subscription has been activated.`
              : undefined
        }
        txHash={txHash}
        error={error}
        onClose={handleClose}
        onRetry={txStatus === 'error' ? handleRetry : undefined}
      />
    </>
  )
}