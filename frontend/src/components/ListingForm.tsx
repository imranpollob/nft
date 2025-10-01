'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'

interface ListingFormData {
  nftAddress: string
  tokenId: string
  pricePerSecond: string
  minDuration: string
  maxDuration: string
  deposit: string
}

interface ListingFormProps {
  initialData?: Partial<ListingFormData>
  onSubmit: (data: ListingFormData) => Promise<void>
  isSubmitting?: boolean
  submitLabel?: string
}

export function ListingForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Create Listing',
}: ListingFormProps) {
  const { address } = useAccount()
  const [formData, setFormData] = useState<ListingFormData>({
    nftAddress: initialData?.nftAddress || '',
    tokenId: initialData?.tokenId || '',
    pricePerSecond: initialData?.pricePerSecond || '',
    minDuration: initialData?.minDuration || '3600', // 1 hour default
    maxDuration: initialData?.maxDuration || '86400', // 24 hours default
    deposit: initialData?.deposit || '0',
  })

  const [errors, setErrors] = useState<Partial<ListingFormData>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<ListingFormData> = {}

    // NFT Address validation
    if (!formData.nftAddress) {
      newErrors.nftAddress = 'NFT contract address is required'
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(formData.nftAddress)) {
      newErrors.nftAddress = 'Invalid Ethereum address format'
    }

    // Token ID validation
    if (!formData.tokenId) {
      newErrors.tokenId = 'Token ID is required'
    } else if (isNaN(Number(formData.tokenId)) || Number(formData.tokenId) < 0) {
      newErrors.tokenId = 'Token ID must be a valid number'
    }

    // Price validation
    if (!formData.pricePerSecond) {
      newErrors.pricePerSecond = 'Price per second is required'
    } else if (isNaN(Number(formData.pricePerSecond)) || Number(formData.pricePerSecond) <= 0) {
      newErrors.pricePerSecond = 'Price must be a positive number'
    }

    // Duration validation
    const minDuration = Number(formData.minDuration)
    const maxDuration = Number(formData.maxDuration)

    if (!formData.minDuration || minDuration < 60) {
      newErrors.minDuration = 'Minimum duration must be at least 60 seconds (1 minute)'
    }

    if (!formData.maxDuration || maxDuration < minDuration) {
      newErrors.maxDuration = 'Maximum duration must be greater than minimum duration'
    }

    if (maxDuration > 2592000) { // 30 days
      newErrors.maxDuration = 'Maximum duration cannot exceed 30 days'
    }

    // Deposit validation (optional)
    if (formData.deposit && (isNaN(Number(formData.deposit)) || Number(formData.deposit) < 0)) {
      newErrors.deposit = 'Deposit must be a valid number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const handleInputChange = (field: keyof ListingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const pricePerHour = formData.pricePerSecond ? (Number(formData.pricePerSecond) * 3600).toFixed(6) : '0'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NFT Contract Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            NFT Contract Address *
          </label>
          <input
            type="text"
            value={formData.nftAddress}
            onChange={(e) => handleInputChange('nftAddress', e.target.value)}
            placeholder="0x..."
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.nftAddress ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.nftAddress && (
            <p className="mt-1 text-sm text-red-600">{errors.nftAddress}</p>
          )}
        </div>

        {/* Token ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Token ID *
          </label>
          <input
            type="text"
            value={formData.tokenId}
            onChange={(e) => handleInputChange('tokenId', e.target.value)}
            placeholder="123"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.tokenId ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.tokenId && (
            <p className="mt-1 text-sm text-red-600">{errors.tokenId}</p>
          )}
        </div>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price per Second (ETH) *
        </label>
        <input
          type="number"
          step="0.000001"
          value={formData.pricePerSecond}
          onChange={(e) => handleInputChange('pricePerSecond', e.target.value)}
          placeholder="0.000001"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.pricePerSecond ? 'border-red-500' : 'border-gray-300'
            }`}
        />
        {formData.pricePerSecond && (
          <p className="mt-1 text-sm text-gray-600">
            ≈ {pricePerHour} ETH per hour
          </p>
        )}
        {errors.pricePerSecond && (
          <p className="mt-1 text-sm text-red-600">{errors.pricePerSecond}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Min Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Minimum Duration (seconds) *
          </label>
          <input
            type="number"
            min="60"
            value={formData.minDuration}
            onChange={(e) => handleInputChange('minDuration', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.minDuration ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {formData.minDuration && (
            <p className="mt-1 text-sm text-gray-600">
              {formatDuration(Number(formData.minDuration))}
            </p>
          )}
          {errors.minDuration && (
            <p className="mt-1 text-sm text-red-600">{errors.minDuration}</p>
          )}
        </div>

        {/* Max Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maximum Duration (seconds) *
          </label>
          <input
            type="number"
            min="60"
            max="2592000"
            value={formData.maxDuration}
            onChange={(e) => handleInputChange('maxDuration', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.maxDuration ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {formData.maxDuration && (
            <p className="mt-1 text-sm text-gray-600">
              {formatDuration(Number(formData.maxDuration))}
            </p>
          )}
          {errors.maxDuration && (
            <p className="mt-1 text-sm text-red-600">{errors.maxDuration}</p>
          )}
        </div>
      </div>

      {/* Deposit */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Security Deposit (ETH)
        </label>
        <input
          type="number"
          step="0.001"
          value={formData.deposit}
          onChange={(e) => handleInputChange('deposit', e.target.value)}
          placeholder="0.0"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.deposit ? 'border-red-500' : 'border-gray-300'
            }`}
        />
        <p className="mt-1 text-sm text-gray-600">
          Optional security deposit returned when rental ends successfully
        </p>
        {errors.deposit && (
          <p className="mt-1 text-sm text-red-600">{errors.deposit}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting || !address}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isSubmitting ? 'Creating Listing...' : submitLabel}
        </button>
      </div>
    </form>
  )
}