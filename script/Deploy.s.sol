// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/Rentable721.sol";
import "../src/ListingManager.sol";
import "../src/RentalManager.sol";
import "../src/Escrow.sol";
import "../src/SubPass1155.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy contracts in dependency order
        Rentable721 rentable721 = new Rentable721();
        console.log("Rentable721 deployed at:", address(rentable721));

        ListingManager listingManager = new ListingManager();
        console.log("ListingManager deployed at:", address(listingManager));

        // Deploy RentalManager first (needed for Escrow)
        RentalManager rentalManager = new RentalManager(
            address(listingManager),
            address(0x1234567890123456789012345678901234567890), // fee recipient placeholder
            500 // 5% protocol fee (500/10000)
        );
        console.log("RentalManager deployed at:", address(rentalManager));

        // Deploy Escrow with RentalManager address
        Escrow escrow = new Escrow(address(rentalManager));
        console.log("Escrow deployed at:", address(escrow));

        SubPass1155 subPass1155 = new SubPass1155("https://api.example.com/metadata/{id}.json");
        console.log("SubPass1155 deployed at:", address(subPass1155));

        vm.stopBroadcast();

        // Output contract addresses for shell script parsing
        console.log("DEPLOYMENT_ADDRESSES:");
        console.log("RENTABLE_721:", vm.toString(address(rentable721)));
        console.log("LISTING_MANAGER:", vm.toString(address(listingManager)));
        console.log("RENTAL_MANAGER:", vm.toString(address(rentalManager)));
        console.log("ESCROW:", vm.toString(address(escrow)));
        console.log("SUB_PASS_1155:", vm.toString(address(subPass1155)));
        console.log("END_DEPLOYMENT_ADDRESSES");
    }
}
