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
] as const