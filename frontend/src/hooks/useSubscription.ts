'use client'

import { useState } from 'react'
import { useReadContract, useWriteContract } from 'wagmi'
import { SUB_PASS_1155_ABI } from '@/lib/abis'
import { getContractAddress } from '@/lib/contracts'
import { useChainId } from 'wagmi'
import { base, polygon } from 'wagmi/chains'
import { MembershipStatus } from '@/lib/types'

export interface BuyOrRenewParams {
  tierId: bigint
  seconds: bigint
}

export function useBuyOrRenew() {
  const [isProcessing, setIsProcessing] = useState(false)
  const { writeContractAsync } = useWriteContract()
  const chainId = useChainId()
  const chain = chainId === base.id ? 'base' : chainId === polygon.id ? 'polygon' : 'base'

  const buyOrRenew = async (params: BuyOrRenewParams) => {
    setIsProcessing(true)
    try {
      // Note: In a real implementation, this would be a payable function
      // For now, we'll assume the contract owner calls this function
      // In production, you'd want a separate function that accepts payment
      const hash = await writeContractAsync({
        address: getContractAddress('SUB_PASS_1155', chain) as `0x${string}`,
        abi: SUB_PASS_1155_ABI,
        functionName: 'mintOrRenew',
        args: [
          '0x0000000000000000000000000000000000000000', // placeholder - would be user's address
          params.tierId,
          params.seconds,
        ],
      })
      return hash
    } finally {
      setIsProcessing(false)
    }
  }

  return {
    buyOrRenew,
    isProcessing,
  }
}

export function useMembershipStatus(userAddress: `0x${string}`, tierId: bigint) {
  const chainId = useChainId()
  const chain = chainId === base.id ? 'base' : chainId === polygon.id ? 'polygon' : 'base'

  const { data: isActive, isLoading: isActiveLoading } = useReadContract({
    address: getContractAddress('SUB_PASS_1155', chain) as `0x${string}`,
    abi: SUB_PASS_1155_ABI,
    functionName: 'isActive',
    args: [userAddress, tierId],
    query: {
      enabled: !!userAddress,
    },
  })

  const { data: activeUntil, isLoading: activeUntilLoading } = useReadContract({
    address: getContractAddress('SUB_PASS_1155', chain) as `0x${string}`,
    abi: SUB_PASS_1155_ABI,
    functionName: 'activeUntilOf',
    args: [userAddress, tierId],
    query: {
      enabled: !!userAddress,
    },
  })

  const membershipStatus: MembershipStatus = {
    tierId,
    isActive: isActive || false,
    activeUntil: activeUntil ? BigInt(activeUntil.toString()) : BigInt(0),
  }

  return {
    membershipStatus,
    isLoading: isActiveLoading || activeUntilLoading,
  }
}