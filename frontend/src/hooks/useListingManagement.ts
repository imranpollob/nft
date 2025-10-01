'use client'

import { useState } from 'react'
import { useWriteContract } from 'wagmi'
import { LISTING_MANAGER_ABI } from '@/lib/abis'
import { getContractAddress } from '@/lib/contracts'
import { useChainId } from 'wagmi'
import { base, polygon } from 'wagmi/chains'

export interface CreateListingParams {
  nftAddress: `0x${string}`
  tokenId: bigint
  pricePerSecond: bigint
  minDuration: bigint
  maxDuration: bigint
  deposit: bigint
  availabilityHash?: `0x${string}`
}

export type UpdateListingParams = CreateListingParams

export function useCreateListing() {
  const [isCreating, setIsCreating] = useState(false)
  const { writeContractAsync } = useWriteContract()
  const chainId = useChainId()
  const chain = chainId === base.id ? 'base' : chainId === polygon.id ? 'polygon' : 'base'

  const createListing = async (params: CreateListingParams) => {
    setIsCreating(true)
    try {
      const hash = await writeContractAsync({
        address: getContractAddress('LISTING_MANAGER', chain) as `0x${string}`,
        abi: LISTING_MANAGER_ABI,
        functionName: 'createListing',
        args: [
          params.nftAddress,
          params.tokenId,
          params.pricePerSecond,
          params.minDuration,
          params.maxDuration,
          params.deposit,
          params.availabilityHash || '0x0000000000000000000000000000000000000000000000000000000000000000',
        ],
      })
      return hash
    } finally {
      setIsCreating(false)
    }
  }

  return {
    createListing,
    isCreating,
  }
}

export function useUpdateListing() {
  const [isUpdating, setIsUpdating] = useState(false)
  const { writeContractAsync } = useWriteContract()
  const chainId = useChainId()
  const chain = chainId === base.id ? 'base' : chainId === polygon.id ? 'polygon' : 'base'

  const updateListing = async (params: UpdateListingParams) => {
    setIsUpdating(true)
    try {
      const hash = await writeContractAsync({
        address: getContractAddress('LISTING_MANAGER', chain) as `0x${string}`,
        abi: LISTING_MANAGER_ABI,
        functionName: 'updateListing',
        args: [
          params.nftAddress,
          params.tokenId,
          params.pricePerSecond,
          params.minDuration,
          params.maxDuration,
          params.deposit,
          params.availabilityHash || '0x0000000000000000000000000000000000000000000000000000000000000000',
        ],
      })
      return hash
    } finally {
      setIsUpdating(false)
    }
  }

  return {
    updateListing,
    isUpdating,
  }
}

export function useCancelListing() {
  const [isCanceling, setIsCanceling] = useState(false)
  const { writeContractAsync } = useWriteContract()
  const chainId = useChainId()
  const chain = chainId === base.id ? 'base' : chainId === polygon.id ? 'polygon' : 'base'

  const cancelListing = async (nftAddress: `0x${string}`, tokenId: bigint) => {
    setIsCanceling(true)
    try {
      const hash = await writeContractAsync({
        address: getContractAddress('LISTING_MANAGER', chain) as `0x${string}`,
        abi: LISTING_MANAGER_ABI,
        functionName: 'cancelListing',
        args: [nftAddress, tokenId],
      })
      return hash
    } finally {
      setIsCanceling(false)
    }
  }

  return {
    cancelListing,
    isCanceling,
  }
}