'use client'

import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

export function Header() {
  const { isConnected } = useAccount()

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700">
              NFT Rental Marketplace
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/listings" className="text-gray-600 hover:text-gray-900">
                Browse
              </Link>
              {isConnected && (
                <>
                  <Link href="/owner" className="text-gray-600 hover:text-gray-900">
                    List NFT
                  </Link>
                  <Link href="/me" className="text-gray-600 hover:text-gray-900">
                    My Rentals
                  </Link>
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  )
}