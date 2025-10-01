'use client'

import { useEffect } from 'react'

export type TxStatus = 'idle' | 'pending' | 'success' | 'error'

interface TxDialogProps {
  isOpen: boolean
  status: TxStatus
  title: string
  message?: string
  txHash?: string
  error?: string
  onClose: () => void
  onRetry?: () => void
}

export function TxDialog({
  isOpen,
  status,
  title,
  message,
  txHash,
  error,
  onClose,
  onRetry,
}: TxDialogProps) {
  useEffect(() => {
    if (status === 'success' || status === 'error') {
      // Auto-close after 5 seconds for success/error states
      const timer = setTimeout(onClose, 5000)
      return () => clearTimeout(timer)
    }
  }, [status, onClose])

  if (!isOpen) return null

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        )
      case 'success':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )
      case 'error':
        return (
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )
      default:
        return null
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'text-blue-600'
      case 'success':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="text-center">
          {getStatusIcon()}

          <h3 className={`text-lg font-semibold mt-4 ${getStatusColor()}`}>
            {title}
          </h3>

          {message && (
            <p className="text-gray-600 mt-2">{message}</p>
          )}

          {status === 'pending' && (
            <p className="text-sm text-gray-500 mt-2">
              Please wait while we process your transaction...
            </p>
          )}

          {status === 'success' && txHash && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Transaction successful!</p>
              <a
                href={`https://basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                View on BaseScan
              </a>
            </div>
          )}

          {status === 'error' && error && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="mt-6 flex justify-center space-x-3">
            {status === 'error' && onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            )}

            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-md transition-colors ${status === 'pending'
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              disabled={status === 'pending'}
            >
              {status === 'pending' ? 'Processing...' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}