# NFT Rental Marketplace

A comprehensive Ethereum-based NFT rental marketplace built with Solidity and Foundry. This platform enables NFT owners to list their assets for time-based rentals while providing renters with temporary access to exclusive digital assets.

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

## 📋 Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation.html)
- [Node.js](https://nodejs.org/) (for additional tooling)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/imranpollob/nft.git
cd nft
```

2. Install dependencies:
```bash
forge install
```

3. Build the contracts:
```bash
forge build
```

## 🧪 Testing

Run the comprehensive test suite:
```bash
forge test
```

### Test Coverage
- **46 total tests** across all contracts
- Unit tests for individual components
- Integration tests for cross-contract interactions
- Rental conflict prevention
- Transfer safety mechanisms
- Subscription renewal logic
- Royalty calculations
- Access control validation

## 📖 Usage

### Local Development

Start a local Ethereum node:
```bash
anvil
```

### Deployment

Deploy contracts using Foundry scripts:
```bash
forge script script/Deploy.s.sol --rpc-url <rpc_url> --private-key <private_key>
```

### Key Functions

#### Creating a Listing
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

#### Renting an NFT
```solidity
rentalManager.rent{value: totalCost}(
    nftAddress,
    tokenId,
    startTime,
    endTime
);
```

#### Managing Subscriptions
```solidity
subPass.mintOrRenew(
    userAddress,
    tierId,
    durationInSeconds
);
```

## 🔒 Security

- **Audited Components**: Built on OpenZeppelin battle-tested contracts
- **Reentrancy Protection**: NonReentrant modifiers on critical functions
- **Input Validation**: Comprehensive checks for all user inputs
- **Access Control**: Owner-only functions with proper authorization

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
- Ethereum community for standards and best practices

---

Built with ❤️ for the decentralized future
