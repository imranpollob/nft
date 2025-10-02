// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/Rentable721.sol";
import "../src/ListingManager.sol";
import "../src/RentalManager.sol";

contract SetupDemo is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Get contract addresses from environment
        address rentable721Addr = vm.envAddress("RENTABLE_721");
        address listingManagerAddr = vm.envAddress("LISTING_MANAGER");
        address rentalManagerAddr = vm.envAddress("RENTAL_MANAGER");

        Rentable721 rentable = Rentable721(rentable721Addr);
        ListingManager listingManager = ListingManager(listingManagerAddr);
        RentalManager rentalManager = RentalManager(rentalManagerAddr);

        // Mint some NFTs to the deployer (first Anvil account)
        address owner = vm.addr(deployerPrivateKey);
        console.log("Minting NFTs to:", owner);

        rentable.mintWithMetadata(
            owner,
            1,
            "Cosmic Ape #1",
            "A rare cosmic ape from the depths of the metaverse",
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkNvc21pYyBBcGUgIzE8L3RleHQ+PC9zdmc+",
            "Cosmic Apes"
        );
        rentable.mintWithMetadata(
            owner,
            2,
            "Digital Dragon #2",
            "A majestic digital dragon with fiery breath",
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzY2NkZGRiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkRpZ2l0YWwgRHJhZ29uICMyPC90ZXh0Pjwvc3ZnPg==",
            "Digital Dragons"
        );
        rentable.mintWithMetadata(
            owner,
            3,
            "Pixel Punk #3",
            "A retro pixel art punk from the 80s revival",
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzMzNjY5OSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPlBpeGVsIFB1bmsgIzM8L3RleHQ+PC9zdmc+",
            "Pixel Punks"
        );
        rentable.mintWithMetadata(
            owner,
            4,
            "Neon Cat #4",
            "A glowing neon cat that lights up the night",
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iPk5lb24gQ2F0ICM0PC90ZXh0Pjwvc3ZnPg==",
            "Neon Cats"
        );

        console.log("Minted 4 NFTs with metadata");

        // Approve rental manager to manage NFTs
        rentable.setApprovalForAll(address(rentalManager), true);
        console.log("Approved RentalManager for all NFTs");

        // Create listings with different prices
        // Price per second: 0.001 ETH/second = 1000000000000000 wei/second
        // Min duration: 1 hour = 3600 seconds
        // Max duration: 24 hours = 86400 seconds
        // Deposit: 0.1 ETH = 100000000000000000 wei

        listingManager.createListing(
            address(rentable),
            1,
            1000000000000000, // 0.001 ETH/second
            3600, // 1 hour min
            86400, // 24 hours max
            100000000000000000, // 0.1 ETH deposit
            bytes32(0)
        );

        listingManager.createListing(
            address(rentable),
            2,
            2000000000000000, // 0.002 ETH/second
            1800, // 30 min min
            43200, // 12 hours max
            50000000000000000, // 0.05 ETH deposit
            bytes32(0)
        );

        listingManager.createListing(
            address(rentable),
            3,
            500000000000000, // 0.0005 ETH/second
            7200, // 2 hours min
            172800, // 48 hours max
            200000000000000000, // 0.2 ETH deposit
            bytes32(0)
        );

        listingManager.createListing(
            address(rentable),
            4,
            1500000000000000, // 0.0015 ETH/second
            3600, // 1 hour min
            86400, // 24 hours max
            100000000000000000, // 0.1 ETH deposit
            bytes32(0)
        );

        console.log("Created 4 listings for NFTs");

        vm.stopBroadcast();

        console.log("Demo setup complete!");
        console.log("NFTs minted and listed for rental");
    }
}
