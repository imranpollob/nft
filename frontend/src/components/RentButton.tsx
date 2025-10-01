'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useRent } from '@/hooks/useRent'
import { TxDialog, TxStatus } from '@/components/TxDialog'
import { RentalCost } from '@/lib/types'

interface RentButtonProps {
  nftAddress: `0x${string}`
  tokenId: bigint
  startDate: Date
  endDate: Date
  rentalCost: RentalCost
  disabled?: boolean
  onSuccess?: () => void
}

export function RentButton({
  nftAddress,
  tokenId,
  startDate,
  endDate,
  rentalCost,
  disabled = false,
  onSuccess,
}: RentButtonProps) {
  const { address } = useAccount()
  const { rent, isRenting } = useRent()
  const [txStatus, setTxStatus] = useState<TxStatus>('idle')
  const [txHash, setTxHash] = useState<string>()
  const [error, setError] = useState<string>()

  const handleRent = async () => {
    if (!address) {
      setError('Please connect your wallet')
      setTxStatus('error')
      return
    }

    setTxStatus('pending')
    setError(undefined)

    try {
      const startTimestamp = BigInt(Math.floor(startDate.getTime() / 1000))
      const endTimestamp = BigInt(Math.floor(endDate.getTime() / 1000))

      const hash = await rent({
        nftAddress,
        tokenId,
        start: startTimestamp,
        end: endTimestamp,
        totalValue: rentalCost.total,
      })

      setTxHash(hash)
      setTxStatus('success')
      onSuccess?.()
    } catch (err: unknown) {
      console.error('Rent error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to rent NFT'
      setError(errorMessage)
      setTxStatus('error')
    }
  }

  const handleRetry = () => {
    handleRent()
  }

  const handleClose = () => {
    setTxStatus('idle')
    setTxHash(undefined)
    setError(undefined)
  }

  const isDisabled = disabled || isRenting || !address

  return (
    <>
      <button
        onClick={handleRent}
        disabled={isDisabled}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isRenting ? 'Processing...' : 'Rent Now'}
      </button>

      <TxDialog
        isOpen={txStatus !== 'idle'}
        status={txStatus}
        title={
          txStatus === 'pending'
            ? 'Renting NFT'
            : txStatus === 'success'
              ? 'Rental Successful!'
              : 'Rental Failed'
        }
        message={
          txStatus === 'pending'
            ? 'Confirming your rental transaction...'
            : txStatus === 'success'
              ? 'Your NFT rental has been confirmed.'
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