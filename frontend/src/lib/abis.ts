// Contract ABIs for read operations
export const RENTABLE_721_ABI = [
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'userOf',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const LISTING_MANAGER_ABI = [
  {
    inputs: [
      { name: 'nft', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    name: 'getListing',
    outputs: [
      {
        components: [
          { name: 'owner', type: 'address' },
          { name: 'pricePerSecond', type: 'uint256' },
          { name: 'minDuration', type: 'uint256' },
          { name: 'maxDuration', type: 'uint256' },
          { name: 'deposit', type: 'uint256' },
          { name: 'availabilityHash', type: 'bytes32' },
          { name: 'active', type: 'bool' },
          { name: 'nonce', type: 'uint256' },
        ],
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'nft', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
      { name: 'pricePerSecond', type: 'uint256' },
      { name: 'minDuration', type: 'uint256' },
      { name: 'maxDuration', type: 'uint256' },
      { name: 'deposit', type: 'uint256' },
      { name: 'availabilityHash', type: 'bytes32' },
    ],
    name: 'createListing',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'nft', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
      { name: 'pricePerSecond', type: 'uint256' },
      { name: 'minDuration', type: 'uint256' },
      { name: 'maxDuration', type: 'uint256' },
      { name: 'deposit', type: 'uint256' },
      { name: 'availabilityHash', type: 'bytes32' },
    ],
    name: 'updateListing',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'nft', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    name: 'cancelListing',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export const ERC721_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'operator', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'operator', type: 'address' },
      { name: 'approved', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const RENTAL_MANAGER_ABI = [
  {
    inputs: [
      { name: 'nft', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
      { name: 'start', type: 'uint256' },
      { name: 'end', type: 'uint256' },
    ],
    name: 'rent',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'nft', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    name: 'getRentals',
    outputs: [
      {
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'renter', type: 'address' },
          { name: 'start', type: 'uint256' },
          { name: 'end', type: 'uint256' },
          { name: 'amount', type: 'uint256' },
          { name: 'deposit', type: 'uint256' },
          { name: 'finalized', type: 'bool' },
        ],
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'rentalId', type: 'uint256' },
      { name: 'nft', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    name: 'finalize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export const SUB_PASS_1155_ABI = [
  {
    inputs: [
      { name: 'addr', type: 'address' },
      { name: 'tierId', type: 'uint256' },
    ],
    name: 'isActive',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'addr', type: 'address' },
      { name: 'tierId', type: 'uint256' },
    ],
    name: 'activeUntilOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'tierId', type: 'uint256' },
      { name: 'seconds_', type: 'uint256' },
    ],
    name: 'mintOrRenew',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const