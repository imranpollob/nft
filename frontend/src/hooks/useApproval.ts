'use client'

import { useState } from 'react'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { ERC721_ABI } from '@/lib/abis'

export function useApproval(nftAddress: `0x${string}`, spenderAddress: `0x${string}`) {
  const { address } = useAccount()

  const { data: isApproved, isLoading, refetch } = useReadContract({
    address: nftAddress,
    abi: ERC721_ABI,
    functionName: 'isApprovedForAll',
    args: address && spenderAddress ? [address, spenderAddress] : undefined,
    query: {
      enabled: !!address && !!spenderAddress,
    },
  })

  return {
    isApproved: !!isApproved,
    isLoading,
    refetch,
  }
}

export function useApproveNft() {
  const [isApproving, setIsApproving] = useState(false)
  const { writeContractAsync } = useWriteContract()

  const approve = async (nftAddress: `0x${string}`, spenderAddress: `0x${string}`) => {
    setIsApproving(true)
    try {
      const hash = await writeContractAsync({
        address: nftAddress,
        abi: ERC721_ABI,
        functionName: 'setApprovalForAll',
        args: [spenderAddress, true],
      })
      return hash
    } finally {
      setIsApproving(false)
    }
  }

  return {
    approve,
    isApproving,
  }
}