'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import Image from 'next/image'
import { useListing } from '@/hooks/useListings'
import { useUpdateListing, useCancelListing } from '@/hooks/useListingManagement'
import { ListingForm } from '@/components/ListingForm'
import { TxDialog, TxStatus } from '@/components/TxDialog'
import Link from 'next/link'

export default function ListingManagementPage() {
  const params = useParams()
  const router = useRouter()
  const { address } = useAccount()
  const listingId = params.listingId as string

  const [txHash, setTxHash] = useState<string>()
  const [txStatus, setTxStatus] = useState<TxStatus>('idle')
  const [error, setError] = useState<string>()
  const [action, setAction] = useState<'update' | 'cancel'>()

  const { listing, isLoading } = useListing(
    listingId.split('-')[0] as `0x${string}`,
    listingId.split('-')[1]
  )

  const { updateListing, isUpdating } = useUpdateListing()
  const { cancelListing, isCanceling } = useCancelListing()

  useEffect(() => {
    if (listing && address && listing.owner.toLowerCase() !== address.toLowerCase()) {
      router.push('/owner')
    }
  }, [listing, address, router])

  const handleUpdate = async (formData: {
    nftAddress: string
    tokenId: string
    pricePerSecond: string
    minDuration: string
    maxDuration: string
    deposit: string
  }) => {
    if (!listing) return

    try {
      setAction('update')
      setTxStatus('pending')
      setError(undefined)

      const hash = await updateListing({
        nftAddress: listing.nftAddress,
        tokenId: listing.tokenId,
        pricePerSecond: BigInt(Math.floor(Number(formData.pricePerSecond) * 1e18)),
        minDuration: BigInt(formData.minDuration),
        maxDuration: BigInt(formData.maxDuration),
        deposit: BigInt(Math.floor(Number(formData.deposit || 0) * 1e18)),
      })

      setTxHash(hash)
    } catch (err) {
      setTxStatus('error')
      setError(err instanceof Error ? err.message : 'Failed to update listing')
    }
  }

  const handleCancel = async () => {
    if (!listing) return

    try {
      setAction('cancel')
      setTxStatus('pending')
      setError(undefined)

      const hash = await cancelListing(listing.nftAddress, listing.tokenId)
      setTxHash(hash)
    } catch (err) {
      setTxStatus('error')
      setError(err instanceof Error ? err.message : 'Failed to cancel listing')
    }
  }

  const handleTxSuccess = () => {
    // Redirect to dashboard after successful action
    router.push('/owner')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading listing...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-red-600">Listing not found</p>
            <Link
              href="/owner"
              className="mt-4 inline-block text-blue-600 hover:text-blue-800"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!address || listing.owner.toLowerCase() !== address.toLowerCase()) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-red-600">You don&apos;t have permission to manage this listing</p>
            <Link
              href="/owner"
              className="mt-4 inline-block text-blue-600 hover:text-blue-800"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const initialFormData = {
    nftAddress: listing.nftAddress,
    tokenId: listing.tokenId.toString(),
    pricePerSecond: (Number(listing.pricePerSecond) / 1e18).toString(),
    minDuration: listing.minDuration.toString(),
    maxDuration: listing.maxDuration.toString(),
    deposit: (Number(listing.deposit) / 1e18).toString(),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Listing</h1>
              <p className="text-gray-600">
                {listing.name || `NFT #${listing.tokenId}`} - {listing.collection}
              </p>
            </div>
            <Link
              href="/mylistings"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Listing Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-lg font-semibold mb-4">Listing Preview</h2>

              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative">
                  {listing.image ? (
                    <Image
                      src={listing.image}
                      alt={listing.name || `NFT ${listing.tokenId}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-4xl">🖼️</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`font-medium ${listing.active ? 'text-green-600' : 'text-red-600'}`}>
                      {listing.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price/Hour</span>
                    <span className="font-medium">
                      {(Number(listing.pricePerSecond) * 3600 / 1e18).toFixed(4)} ETH
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min Duration</span>
                    <span className="font-medium">
                      {Math.floor(Number(listing.minDuration) / 3600)}h {Math.floor((Number(listing.minDuration) % 3600) / 60)}m
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Duration</span>
                    <span className="font-medium">
                      {Math.floor(Number(listing.maxDuration) / 3600)}h {Math.floor((Number(listing.maxDuration) % 3600) / 60)}m
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Management Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Update Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Update Listing</h2>
              <ListingForm
                initialData={initialFormData}
                onSubmit={handleUpdate}
                isSubmitting={isUpdating || (txStatus === 'pending' && action === 'update')}
                submitLabel="Update Listing"
              />
            </div>

            {/* Cancel Listing */}
            {listing.active && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
                <p className="text-gray-600 mb-4">
                  Canceling your listing will remove it from the marketplace. You can reactivate it later by updating the listing.
                </p>
                <button
                  onClick={handleCancel}
                  disabled={isCanceling || (txStatus === 'pending' && action === 'cancel')}
                  className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isCanceling || (txStatus === 'pending' && action === 'cancel') ? 'Canceling...' : 'Cancel Listing'}
                </button>
              </div>
            )}

            {/* Rental History - Mock for now */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Rental History</h2>
              <div className="text-center py-8 text-gray-500">
                <p>No rental history yet</p>
                <p className="text-sm mt-1">Rental history will appear here once your NFT is rented</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TxDialog
        isOpen={txStatus !== 'idle'}
        status={txStatus}
        title={
          txStatus === 'pending'
            ? action === 'update' ? 'Updating Listing' : 'Canceling Listing'
            : txStatus === 'success'
              ? action === 'update' ? 'Listing Updated!' : 'Listing Canceled!'
              : action === 'update' ? 'Update Failed' : 'Cancel Failed'
        }
        message={
          txStatus === 'pending'
            ? `Please wait while we ${action === 'update' ? 'update' : 'cancel'} your listing...`
            : txStatus === 'success'
              ? `Your listing has been ${action === 'update' ? 'updated' : 'canceled'} successfully!`
              : undefined
        }
        txHash={txHash}
        error={error}
        onClose={handleTxSuccess}
      />
    </div>
  )
}