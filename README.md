# NFT Rental Marketplace

A comprehensive full-stack Ethereum-based NFT rental marketplace built with Solidity, Foundry, Next.js, and TypeScript. This platform enables NFT owners to list their assets for time-based rentals while providing renters with temporary access to exclusive digital assets, complete with a subscription system for premium features.

## 🚀 Features

### Core Rental System
- **Time-based Rentals**: Rent NFTs for specific durations with precise start/end times
- **Conflict Prevention**: Advanced overlap detection prevents double-booking
- **Secure Escrow**: Funds are held safely until rental completion
- **Protocol Fees**: Configurable fee structure with automatic distribution

### Advanced Security
- **Transfer Protection**: Prevents unauthorized transfers during active rentals
- **Role-based Access**: Marketplace-controlled user assignment for rentals
- **Reentrancy Guards**: Protection against common smart contract vulnerabilities
- **Ownership Validation**: Race condition prevention for listing changes

### Subscription System
- **ERC-1155 Membership Passes**: Time-boxed subscriptions for premium services
- **Multiple Tiers**: Flexible tier system with independent expiry tracking
- **Soulbound Options**: Optional transfer restrictions per subscription tier
- **Renewal Logic**: Seamless extension of active memberships

### Frontend Application
- **Modern React UI**: Built with Next.js 15, TypeScript, and Tailwind CSS
- **Wallet Integration**: RainbowKit and wagmi for seamless Web3 connectivity
- **Real-time Updates**: Live countdown timers and status updates
- **Responsive Design**: Mobile-first design for all devices
- **Gated Content**: Subscription-based content access control

### Royalty Support
- **ERC-2981 Compatible**: Standard royalty implementation for secondary sales
- **Configurable Rates**: Default 5% royalty to original creators

## 🏗️ Architecture

### Core Contracts

#### Rentable721.sol
- ERC-721 compliant NFT with rental extensions
- ERC-4907 interface for user assignment
- Transfer guards during active rentals
- Royalty support via ERC-2981

#### ListingManager.sol
- Manages NFT listings with pricing and availability
- Owner validation and listing lifecycle
- Availability hash for external scheduling

#### RentalManager.sol
- Orchestrates rental transactions
- Conflict checking and fund management
- Integration with escrow system
- Event emission for transparency

#### Escrow.sol
- Secure fund holding during rentals
- Protocol fee calculation and distribution
- Release mechanisms for owners and renters

#### SubPass1155.sol
- ERC-1155 based subscription system
- Time-based membership tracking
- Soulbound transfer restrictions
- Multi-tier support

### Frontend Application Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── asset/[...]/       # Individual NFT detail pages
│   ├── listings/          # NFT listings browser
│   ├── owner/             # Owner dashboard
│   ├── me/                # Renter dashboard
│   ├── account/           # User account & subscriptions
│   ├── subscriptions/     # Subscription tiers
│   └── gated-demo/        # Protected content demo
├── components/            # Reusable React components
├── hooks/                 # Custom React hooks for blockchain
├── lib/                   # Utilities and configurations
└── types/                 # TypeScript type definitions
```

## 📋 Prerequisites

### Smart Contracts
- [Foundry](https://book.getfoundry.sh/getting-started/installation.html)

### Frontend Application
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/imranpollob/nft.git
cd nft
```

2. Install smart contract dependencies:
```bash
forge install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

### 🚀 Quick Development Setup

For a **new computer** or **fresh environment**, run the automated setup script:

```bash
# This will start Anvil, deploy all contracts, and configure the frontend
./setup-dev.sh
```

This script will:
- ✅ Check all dependencies (Foundry, Node.js, npm)
- ✅ Start Anvil local Ethereum node
- ✅ Deploy all smart contracts
- ✅ Auto-generate `.env.local` with deployed addresses
- ✅ Install frontend dependencies
- ✅ Test the build

### 🔄 Redeploy Contracts

If you already have the environment set up and just want to redeploy contracts:

```bash
# Make sure Anvil is running
anvil

# In another terminal, redeploy contracts
./redeploy.sh
```

## 🧪 Testing

### Smart Contracts
Run the comprehensive test suite:
```bash
forge test
```

**Test Coverage:**
- **46 total tests** across all contracts
- Unit tests for individual components
- Integration tests for cross-contract interactions
- Rental conflict prevention
- Transfer safety mechanisms
- Subscription renewal logic
- Royalty calculations
- Access control validation

### Frontend Application
Run the development server:
```bash
cd frontend
npm run dev
```

Build for production:
```bash
npm run build
```

## 📖 Usage

### Local Development

#### Option 1: Automated Setup (Recommended)
```bash
./setup-dev.sh
```

#### Option 2: Manual Setup
Start a local Ethereum node:
```bash
anvil
```

Deploy contracts and update environment:
```bash
./redeploy.sh
```

Start the frontend development server:
```bash
cd frontend
npm run dev
```

### Environment Configuration

The deployment scripts automatically create/update `frontend/.env.local` with deployed contract addresses. The file includes:

```bash
# Contract Addresses (Auto-generated by deployment script)
NEXT_PUBLIC_RENTABLE_721_BASE=0x5fbdb2315678afecb367f032d93f642f64180aa3
NEXT_PUBLIC_LISTING_MANAGER_BASE=0xe7f1725e7734ce288f8367e1bb143e90bb3f0512
NEXT_PUBLIC_RENTAL_MANAGER_BASE=0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0
NEXT_PUBLIC_ESCROW_BASE=0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9
NEXT_PUBLIC_SUB_PASS_1155_BASE=0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
```

### Testing the Application

1. Open http://localhost:3000
2. Connect your wallet (MetaMask, etc.)
3. Start testing the marketplace features:
   - Browse NFT listings
   - Create/manage listings (owner dashboard)
   - Rent NFTs
   - Purchase subscriptions
   - View gated content

## 📖 Usage

### Smart Contracts

#### Local Development
Start a local Ethereum node:
```bash
anvil
```

#### Deployment
Deploy contracts using Foundry scripts:
```bash
forge script script/Deploy.s.sol --rpc-url <rpc_url> --private-key <private_key>
```

#### Key Functions

**Creating a Listing:**
```solidity
listingManager.createListing(
    nftAddress,
    tokenId,
    pricePerSecond,
    minDuration,
    maxDuration,
    depositAmount,
    availabilityHash
);
```

**Renting an NFT:**
```solidity
rentalManager.rent{value: totalCost}(
    nftAddress,
    tokenId,
    startTime,
    endTime
);
```

**Managing Subscriptions:**
```solidity
subPass.mintOrRenew(
    userAddress,
    tierId,
    durationInSeconds
);
```

### Frontend Application

#### Environment Setup
Create a `.env.local` file in the `frontend/` directory:
```bash
# WalletConnect Project ID (get from https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Default chain (base or polygon)
NEXT_PUBLIC_DEFAULT_CHAIN=base

# RPC URLs
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-rpc.com

# Contract Addresses (update with deployed addresses)
NEXT_PUBLIC_RENTABLE_721_BASE=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_RENTABLE_721_POLYGON=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_LISTING_MANAGER_BASE=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_LISTING_MANAGER_POLYGON=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_RENTAL_MANAGER_BASE=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_RENTAL_MANAGER_POLYGON=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_ESCROW_BASE=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_ESCROW_POLYGON=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_SUB_PASS_1155_BASE=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_SUB_PASS_1155_POLYGON=0x0000000000000000000000000000000000000000
```

#### User Flows

**For NFT Owners:**
1. Connect wallet and navigate to `/owner`
2. Approve NFT for marketplace
3. Create listing with pricing and duration constraints
4. Manage active listings and view earnings

**For NFT Renters:**
1. Connect wallet and browse `/listings`
2. View NFT details and select rental duration
3. Complete rental transaction with secure escrow
4. Access rented NFT during rental period
5. View rental history in `/me`

**For Subscribers:**
1. Visit `/subscriptions` to view available tiers
2. Select duration and purchase subscription
3. View membership status in `/account`
4. Access gated content in `/gated-demo`

## 🔒 Security

### Smart Contracts
- **Audited Components**: Built on OpenZeppelin battle-tested contracts
- **Reentrancy Protection**: NonReentrant modifiers on critical functions
- **Input Validation**: Comprehensive checks for all user inputs
- **Access Control**: Owner-only functions with proper authorization

### Frontend Application
- **Type Safety**: Full TypeScript implementation
- **Input Validation**: Client and server-side validation
- **Secure Connections**: HTTPS and secure Web3 connections
- **Error Handling**: Comprehensive error boundaries and user feedback

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenZeppelin](https://openzeppelin.com/) for secure contract libraries
- [Foundry](https://book.getfoundry.sh/) for the development framework
- [Next.js](https://nextjs.org/) for the React framework
- [RainbowKit](https://www.rainbowkit.com/) for wallet integration
- [wagmi](https://wagmi.sh/) for blockchain interactions
- Ethereum community for standards and best practices

---

Built with ❤️ for the decentralized future
