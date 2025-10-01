'use client'

import { useState } from 'react'
import { useWriteContract } from 'wagmi'
import { RENTAL_MANAGER_ABI } from '@/lib/abis'
import { getContractAddress } from '@/lib/contracts'
import { useChainId } from 'wagmi'
import { base, polygon } from 'wagmi/chains'

export interface RentParams {
  nftAddress: `0x${string}`
  tokenId: bigint
  start: bigint
  end: bigint
  totalValue: bigint
}

export function useRent() {
  const [isRenting, setIsRenting] = useState(false)
  const { writeContractAsync } = useWriteContract()
  const chainId = useChainId()
  const chain = chainId === base.id ? 'base' : chainId === polygon.id ? 'polygon' : 'base'

  const rent = async (params: RentParams) => {
    setIsRenting(true)
    try {
      const hash = await writeContractAsync({
        address: getContractAddress('RENTAL_MANAGER', chain) as `0x${string}`,
        abi: RENTAL_MANAGER_ABI,
        functionName: 'rent',
        args: [
          params.nftAddress,
          params.tokenId,
          params.start,
          params.end,
        ],
        value: params.totalValue,
      })
      return hash
    } finally {
      setIsRenting(false)
    }
  }

  return {
    rent,
    isRenting,
  }
}