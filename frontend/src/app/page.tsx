'use client'

import { useAccount } from 'wagmi'
import { useRentQuote, useHasActiveUse, useIsMember } from '@/hooks/useContractReads'

export default function Home() {
  const { address, isConnected } = useAccount()

  // Hardcoded test values
  const testListing = {
    nft: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    tokenId: 1n,
  }
  const testStart = BigInt(Math.floor(Date.now() / 1000) + 3600) // 1 hour from now
  const testEnd = testStart + 3600n // 1 hour rental
  const testTierId = 1n

  const { cost, deposit, total, isLoading: quoteLoading } = useRentQuote(testListing, testStart, testEnd)
  const { hasActiveUse, isLoading: activeUseLoading } = useHasActiveUse(
    address || '0x0000000000000000000000000000000000000000',
    testListing.nft,
    testListing.tokenId
  )
  const { isMember, isLoading: memberLoading } = useIsMember(
    address || '0x0000000000000000000000000000000000000000',
    testTierId
  )

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">NFT Rental Marketplace - Test Page</h1>
        <p className="text-gray-600">
          This page demonstrates the contract read functionality for Phase 1.
        </p>
      </div>

      {!isConnected ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">Wallet Not Connected</h2>
          <p className="text-yellow-700">
            Please connect your wallet using the button in the header to see the test data.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Rent Quote Test</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700">Rental Cost</h3>
                <p className="text-2xl font-bold text-green-600">
                  {quoteLoading ? 'Loading...' : `${(Number(cost) / 1e18).toFixed(4)} ETH`}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700">Deposit</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {quoteLoading ? 'Loading...' : `${(Number(deposit) / 1e18).toFixed(4)} ETH`}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700">Total</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {quoteLoading ? 'Loading...' : `${(Number(total) / 1e18).toFixed(4)} ETH`}
                </p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Test listing: NFT {testListing.nft}, Token ID {testListing.tokenId.toString()}<br />
              Duration: 1 hour ({new Date(Number(testStart) * 1000).toLocaleString()} - {new Date(Number(testEnd) * 1000).toLocaleString()})
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User Status Test</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700">Has Active Use</h3>
                <p className={`text-2xl font-bold ${hasActiveUse ? 'text-red-600' : 'text-green-600'}`}>
                  {activeUseLoading ? 'Loading...' : hasActiveUse ? 'Yes' : 'No'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  User: {address?.slice(0, 6)}...{address?.slice(-4)}<br />
                  NFT: {testListing.nft.slice(0, 6)}...{testListing.nft.slice(-4)}, Token ID: {testListing.tokenId.toString()}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700">Is Member</h3>
                <p className={`text-2xl font-bold ${isMember ? 'text-green-600' : 'text-red-600'}`}>
                  {memberLoading ? 'Loading...' : isMember ? 'Yes' : 'No'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  User: {address?.slice(0, 6)}...{address?.slice(-4)}<br />
                  Tier ID: {testTierId.toString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Test Configuration</h2>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Contract addresses are currently set to placeholder values (0x000...)</li>
              <li>• Update the contract addresses in <code>src/lib/contracts.ts</code> with deployed addresses</li>
              <li>• Add RPC URLs to environment variables for proper chain connectivity</li>
              <li>• The hooks will return real data once contracts are deployed and configured</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
href = "https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
target = "_blank"
rel = "noopener noreferrer"
  >
  <Image
    className="dark:invert"
    src="/vercel.svg"
    alt="Vercel logomark"
    width={20}
    height={20}
  />
            Deploy now
          </a >
  <a
    className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
    href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    target="_blank"
    rel="noopener noreferrer"
  >
    Read our docs
  </a>
        </div >
      </main >
  <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
    <a
      className="flex items-center gap-2 hover:underline hover:underline-offset-4"
      href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        aria-hidden
        src="/file.svg"
        alt="File icon"
        width={16}
        height={16}
      />
      Learn
    </a>
    <a
      className="flex items-center gap-2 hover:underline hover:underline-offset-4"
      href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        aria-hidden
        src="/window.svg"
        alt="Window icon"
        width={16}
        height={16}
      />
      Examples
    </a>
    <a
      className="flex items-center gap-2 hover:underline hover:underline-offset-4"
      href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        aria-hidden
        src="/globe.svg"
        alt="Globe icon"
        width={16}
        height={16}
      />
      Go to nextjs.org →
    </a>
  </footer>
    </div >
  );
}
