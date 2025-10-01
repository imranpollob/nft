'use client'

import { useState, useEffect } from 'react'
import { useApproval, useApproveNft } from '@/hooks/useApproval'
import { TxDialog, TxStatus } from './TxDialog'
import { useWaitForTransactionReceipt } from 'wagmi'

interface ApproveNftButtonProps {
  nftAddress: `0x${string}`
  spenderAddress: `0x${string}`
  onApprovalSuccess?: () => void
  children: React.ReactNode
  className?: string
}

export function ApproveNftButton({
  nftAddress,
  spenderAddress,
  onApprovalSuccess,
  children,
  className = '',
}: ApproveNftButtonProps) {
  const [txHash, setTxHash] = useState<string>()
  const [txStatus, setTxStatus] = useState<TxStatus>('idle')
  const [error, setError] = useState<string>()

  const { isApproved, isLoading: approvalLoading, refetch } = useApproval(nftAddress, spenderAddress)
  const { approve, isApproving } = useApproveNft()

  const { isLoading: txLoading, isSuccess, isError, error: txError } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  })

  // Handle success
  useEffect(() => {
    if (isSuccess && txStatus === 'pending') {
      setTxStatus('success')
      refetch()
      onApprovalSuccess?.()
    }
  }, [isSuccess, txStatus, refetch, onApprovalSuccess])

  // Handle error
  useEffect(() => {
    if (isError && txStatus === 'pending') {
      setTxStatus('error')
      setError(txError?.message || 'Transaction failed')
    }
  }, [isError, txStatus, txError])

  const handleApprove = async () => {
    try {
      setTxStatus('pending')
      setError(undefined)
      const hash = await approve(nftAddress, spenderAddress)
      setTxHash(hash)
    } catch (err) {
      setTxStatus('error')
      setError(err instanceof Error ? err.message : 'Approval failed')
    }
  }

  const handleCloseDialog = () => {
    setTxStatus('idle')
    setTxHash(undefined)
    setError(undefined)
  }

  const handleRetry = () => {
    handleApprove()
  }

  if (isApproved) {
    return <>{children}</>
  }

  return (
    <>
      <button
        onClick={handleApprove}
        disabled={isApproving || txLoading || approvalLoading}
        className={`px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
      >
        {approvalLoading ? 'Checking Approval...' : isApproving || txLoading ? 'Approving...' : 'Approve NFT'}
      </button>

      <TxDialog
        isOpen={txStatus !== 'idle'}
        status={txStatus}
        title={
          txStatus === 'pending'
            ? 'Approving NFT'
            : txStatus === 'success'
              ? 'NFT Approved!'
              : 'Approval Failed'
        }
        message={
          txStatus === 'pending'
            ? 'Granting permission for the marketplace to manage your NFT...'
            : txStatus === 'success'
              ? 'Your NFT is now approved for listing.'
              : undefined
        }
        txHash={txHash}
        error={error}
        onClose={handleCloseDialog}
        onRetry={txStatus === 'error' ? handleRetry : undefined}
      />
    </>
  )
}