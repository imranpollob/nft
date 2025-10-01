'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { ListingForm } from '@/components/ListingForm'
import { TxDialog, TxStatus } from '@/components/TxDialog'
import { useCreateListing } from '@/hooks/useListingManagement'

export default function CreateListingPage() {
  const router = useRouter()
  const { address } = useAccount()

  const [txHash, setTxHash] = useState<string>()
  const [txStatus, setTxStatus] = useState<TxStatus>('idle')
  const [error, setError] = useState<string>()

  const { createListing, isCreating } = useCreateListing()

  const handleSubmit = async (formData: {
    nftAddress: string
    tokenId: string
    pricePerSecond: string
    minDuration: string
    maxDuration: string
    deposit: string
  }) => {
    if (!address) {
      setError('Please connect your wallet')
      return
    }

    try {
      setTxStatus('pending')
      setError(undefined)

      const hash = await createListing({
        nftAddress: formData.nftAddress as `0x${string}`,
        tokenId: BigInt(formData.tokenId),
        pricePerSecond: BigInt(Math.floor(Number(formData.pricePerSecond) * 1e18)),
        minDuration: BigInt(formData.minDuration),
        maxDuration: BigInt(formData.maxDuration),
        deposit: BigInt(Math.floor(Number(formData.deposit || 0) * 1e18)),
      })

      setTxHash(hash)
    } catch (err) {
      setTxStatus('error')
      setError(err instanceof Error ? err.message : 'Failed to create listing')
    }
  }

  const handleTxSuccess = () => {
    // Redirect to dashboard after successful creation
    router.push('/owner')
  }

  const handleRetry = () => {
    // Retry logic would need to store the last form data
    setTxStatus('idle')
  }

  if (!address) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">Please connect your wallet to create a listing.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create NFT Listing</h1>
          <p className="text-gray-600">List your NFT for rent on the marketplace</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-8">
          <ListingForm
            onSubmit={handleSubmit}
            isSubmitting={isCreating || txStatus === 'pending'}
            submitLabel="Create Listing"
          />
        </div>

        {/* Help Text */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Listing Requirements</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• You must own the NFT you&apos;re listing</li>
            <li>• The NFT contract must be approved for the marketplace</li>
            <li>• Minimum rental duration is 1 minute (60 seconds)</li>
            <li>• Maximum rental duration is 30 days</li>
            <li>• Price is set per second in ETH</li>
            <li>• Optional security deposit is returned when rental ends</li>
          </ul>
        </div>
      </div>

      <TxDialog
        isOpen={txStatus !== 'idle'}
        status={txStatus}
        title={
          txStatus === 'pending'
            ? 'Creating Listing'
            : txStatus === 'success'
              ? 'Listing Created!'
              : 'Creation Failed'
        }
        message={
          txStatus === 'pending'
            ? 'Please wait while we create your listing...'
            : txStatus === 'success'
              ? 'Your NFT is now listed for rent!'
              : undefined
        }
        txHash={txHash}
        error={error}
        onClose={handleTxSuccess}
        onRetry={txStatus === 'error' ? handleRetry : undefined}
      />
    </div>
  )
}