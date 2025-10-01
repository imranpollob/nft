'use client'

import { useReadContract } from 'wagmi'
import { RENTAL_MANAGER_ABI } from '@/lib/abis'
import { getContractAddress } from '@/lib/contracts'
import { useChainId } from 'wagmi'
import { base, polygon } from 'wagmi/chains'
import { Rental } from '@/lib/types'

export function useRentalsForToken(nftAddress: `0x${string}`, tokenId: bigint) {
  const chainId = useChainId()
  const chain = chainId === base.id ? 'base' : chainId === polygon.id ? 'polygon' : 'base'

  const { data, isLoading, error, refetch } = useReadContract({
    address: getContractAddress('RENTAL_MANAGER', chain) as `0x${string}`,
    abi: RENTAL_MANAGER_ABI,
    functionName: 'getRentals',
    args: [nftAddress, tokenId],
    query: {
      enabled: !!nftAddress && !!tokenId,
    },
  })

  const rentals: Rental[] = data ? data.map((rental: {
    id: bigint
    renter: `0x${string}`
    start: bigint
    end: bigint
    amount: bigint
    deposit: bigint
    finalized: boolean
  }) => ({
    id: rental.id,
    renter: rental.renter,
    start: rental.start,
    end: rental.end,
    amount: rental.amount,
    deposit: rental.deposit,
    finalized: rental.finalized,
    nftAddress,
    tokenId,
  })) : []

  return {
    rentals,
    isLoading,
    error,
    refetch,
  }
}

// Hook to get active rentals (not expired and not finalized)
export function useActiveRentalsForToken(nftAddress: `0x${string}`, tokenId: bigint) {
  const { rentals, isLoading, error, refetch } = useRentalsForToken(nftAddress, tokenId)

  const activeRentals = rentals.filter(rental => {
    const now = BigInt(Math.floor(Date.now() / 1000))
    return rental.end > now && !rental.finalized
  })

  return {
    activeRentals,
    isLoading,
    error,
    refetch,
  }
}

// Hook to get rental history (finalized or expired)
export function useRentalHistoryForToken(nftAddress: `0x${string}`, tokenId: bigint) {
  const { rentals, isLoading, error, refetch } = useRentalsForToken(nftAddress, tokenId)

  const history = rentals.filter(rental => {
    const now = BigInt(Math.floor(Date.now() / 1000))
    return rental.end <= now || rental.finalized
  })

  return {
    history,
    isLoading,
    error,
    refetch,
  }
}