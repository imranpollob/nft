'use client'

import { useReadContract } from 'wagmi'
import { RENTABLE_721_ABI, LISTING_MANAGER_ABI, SUB_PASS_1155_ABI } from '@/lib/abis'
import { getContractAddress, type ChainType } from '@/lib/contracts'
import { useChainId } from 'wagmi'
import { base, polygon } from 'wagmi/chains'

export function useRentQuote(
  listingId: { nft: `0x${string}`, tokenId: bigint },
  start: bigint,
  end: bigint
) {
  const chainId = useChainId()
  const chain = chainId === base.id ? 'base' : chainId === polygon.id ? 'polygon' : 'base'

  // First get the listing details
  const { data: listing, isLoading: listingLoading } = useReadContract({
    address: getContractAddress('LISTING_MANAGER', chain as ChainType) as `0x${string}`,
    abi: LISTING_MANAGER_ABI,
    functionName: 'getListing',
    args: [listingId.nft, listingId.tokenId],
  })

  // Calculate quote based on listing data
  const duration = end - start
  const cost = listing ? (listing.pricePerSecond * duration) / BigInt(10 ** 18) : BigInt(0)
  const deposit = listing?.deposit || BigInt(0)
  const total = cost + deposit

  return {
    cost,
    deposit,
    total,
    isLoading: listingLoading,
    listing,
  }
}

export function useHasActiveUse(
  user: `0x${string}`,
  nft: `0x${string}`,
  tokenId: bigint
) {
  const chainId = useChainId()
  const chain = chainId === base.id ? 'base' : chainId === polygon.id ? 'polygon' : 'base'

  const { data: activeUser, isLoading } = useReadContract({
    address: getContractAddress('RENTABLE_721', chain as ChainType) as `0x${string}`,
    abi: RENTABLE_721_ABI,
    functionName: 'userOf',
    args: [tokenId],
  })

  const hasActiveUse = activeUser === user && activeUser !== '0x0000000000000000000000000000000000000000'

  return {
    hasActiveUse,
    isLoading,
    activeUser,
  }
}

export function useIsMember(user: `0x${string}`, tierId: bigint) {
  const chainId = useChainId()
  const chain = chainId === base.id ? 'base' : chainId === polygon.id ? 'polygon' : 'base'

  const { data: isActive, isLoading } = useReadContract({
    address: getContractAddress('SUB_PASS_1155', chain as ChainType) as `0x${string}`,
    abi: SUB_PASS_1155_ABI,
    functionName: 'isActive',
    args: [user, tierId],
  })

  return {
    isMember: isActive || false,
    isLoading,
  }
}