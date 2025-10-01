// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract ListingManager {
    struct Listing {
        address owner;
        uint256 pricePerSecond;
        uint256 minDuration;
        uint256 maxDuration;
        uint256 deposit;
        bytes32 availabilityHash;
        bool active;
        uint256 nonce;
    }

    mapping(address => mapping(uint256 => Listing)) public listings;

    event ListingCreated(
        address indexed nft,
        uint256 indexed tokenId,
        address indexed owner,
        uint256 pricePerSecond,
        uint256 minDuration,
        uint256 maxDuration,
        uint256 deposit,
        bytes32 availabilityHash,
        uint256 nonce
    );

    event ListingUpdated(
        address indexed nft,
        uint256 indexed tokenId,
        address indexed owner,
        uint256 pricePerSecond,
        uint256 minDuration,
        uint256 maxDuration,
        uint256 deposit,
        bytes32 availabilityHash,
        uint256 nonce
    );

    event ListingCanceled(address indexed nft, uint256 indexed tokenId, address indexed owner, uint256 nonce);

    function createListing(
        address nft,
        uint256 tokenId,
        uint256 pricePerSecond,
        uint256 minDuration,
        uint256 maxDuration,
        uint256 deposit,
        bytes32 availabilityHash
    ) external {
        require(IERC721(nft).ownerOf(tokenId) == msg.sender, "ListingManager: not owner");
        require(!listings[nft][tokenId].active, "ListingManager: already listed");
        require(minDuration <= maxDuration, "ListingManager: invalid durations");

        listings[nft][tokenId] = Listing({
            owner: msg.sender,
            pricePerSecond: pricePerSecond,
            minDuration: minDuration,
            maxDuration: maxDuration,
            deposit: deposit,
            availabilityHash: availabilityHash,
            active: true,
            nonce: 1
        });

        emit ListingCreated(
            nft, tokenId, msg.sender, pricePerSecond, minDuration, maxDuration, deposit, availabilityHash, 1
        );
    }

    function updateListing(
        address nft,
        uint256 tokenId,
        uint256 pricePerSecond,
        uint256 minDuration,
        uint256 maxDuration,
        uint256 deposit,
        bytes32 availabilityHash
    ) external {
        Listing storage listing = listings[nft][tokenId];
        require(listing.active, "ListingManager: not active");
        require(listing.owner == msg.sender, "ListingManager: not listing owner");
        require(IERC721(nft).ownerOf(tokenId) == msg.sender, "ListingManager: not current owner");
        require(minDuration <= maxDuration, "ListingManager: invalid durations");

        listing.pricePerSecond = pricePerSecond;
        listing.minDuration = minDuration;
        listing.maxDuration = maxDuration;
        listing.deposit = deposit;
        listing.availabilityHash = availabilityHash;
        listing.nonce++;

        emit ListingUpdated(
            nft, tokenId, msg.sender, pricePerSecond, minDuration, maxDuration, deposit, availabilityHash, listing.nonce
        );
    }

    function cancelListing(address nft, uint256 tokenId) external {
        Listing storage listing = listings[nft][tokenId];
        require(listing.active, "ListingManager: not active");
        require(listing.owner == msg.sender, "ListingManager: not listing owner");
        require(IERC721(nft).ownerOf(tokenId) == msg.sender, "ListingManager: not current owner");

        listing.active = false;
        listing.nonce++;

        emit ListingCanceled(nft, tokenId, msg.sender, listing.nonce);
    }

    function getListing(address nft, uint256 tokenId) external view returns (Listing memory) {
        return listings[nft][tokenId];
    }
}
