// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Rentable721.sol";
import "../src/ListingManager.sol";
import "../src/RentalManager.sol";
import "../src/Escrow.sol";

contract IntegrationTest is Test {
    Rentable721 rentable;
    ListingManager listingManager;
    RentalManager rentalManager;
    Escrow escrow;

    address owner = makeAddr("owner");
    address renter = makeAddr("renter");
    address other = makeAddr("other");
    address feeRecipient = makeAddr("feeRecipient");
    uint256 tokenId = 1;
    uint256 tierId = 1;

    function setUp() public {
        vm.startPrank(owner);
        // Deploy contracts
        rentable = new Rentable721();
        listingManager = new ListingManager();
        rentalManager = new RentalManager(address(listingManager), feeRecipient, 500); // 5% fee, creates escrow internally

        // Get escrow address from rentalManager
        escrow = Escrow(address(rentalManager.escrow()));

        // Set marketplace on Rentable721
        rentable.setMarketplace(address(rentalManager));
        vm.stopPrank();

        // Mint NFT and approve
        vm.prank(owner);
        rentable.mint(owner, tokenId);
        vm.prank(owner);
        rentable.setApprovalForAll(address(rentalManager), true);

        // Fund accounts
        vm.deal(renter, 10 ether);
        vm.deal(other, 10 ether);
    }

    // 1. Happy Path: Full Rental Cycle
    function testFullRentalCycle() public {
        // Owner creates listing
        vm.prank(owner);
        listingManager.createListing(address(rentable), tokenId, 277777777777777, 3600, 86400, 0.1 ether, bytes32(0)); // ~0.000277 ether/second

        // Renter rents for 1 hour
        uint256 start = block.timestamp + 100;
        uint256 end = start + 3600;
        uint256 cost = 277777777777777 * 3600; // 1 ether equivalent
        uint256 deposit = 0.1 ether;
        uint256 total = cost + deposit;

        vm.prank(renter);
        rentalManager.rent{value: total}(address(rentable), tokenId, start, end);

        // Check user assigned
        assertEq(rentable.userOf(tokenId), renter);

        // Fast-forward to end
        vm.warp(end + 1);

        // Finalize rental
        vm.prank(renter); // Anyone can finalize
        rentalManager.finalize(1, address(rentable), tokenId);

        // Check payouts: owner gets cost - fee, renter gets deposit
        uint256 fee = cost * 500 / 10000; // 5%
        assertEq(owner.balance, cost - fee);
        assertEq(renter.balance, 10 ether - total + deposit); // Refunded deposit
        assertEq(feeRecipient.balance, fee);

        // User cleared
        assertEq(rentable.userOf(tokenId), address(0));
    }

    // 2. Edge Case: Boundary Conditions (Exact Expiry)
    function testBoundaryExactExpiry() public {
        vm.prank(owner);
        listingManager.createListing(address(rentable), tokenId, 277777777777777, 3600, 86400, 0, bytes32(0));

        uint256 start = block.timestamp + 100;
        uint256 end = start + 3600;

        vm.prank(renter);
        rentalManager.rent{value: 1 ether}(address(rentable), tokenId, start, end);

        // At exact end - 1 second, still active
        vm.warp(end - 1);
        assertEq(rentable.userOf(tokenId), renter);

        // At exact end, expired
        vm.warp(end);
        assertEq(rentable.userOf(tokenId), address(0));

        // Just after
        vm.warp(end + 1);
        assertEq(rentable.userOf(tokenId), address(0));
    }

    // 3. Failure Scenario: Insufficient Funds
    function testInsufficientFunds() public {
        vm.prank(owner);
        listingManager.createListing(address(rentable), tokenId, 277777777777777, 3600, 86400, 0.1 ether, bytes32(0));

        vm.prank(renter);
        vm.expectRevert("RentalManager: insufficient payment");
        rentalManager.rent{value: 0.5 ether}(address(rentable), tokenId, block.timestamp + 100, block.timestamp + 3700);
    }

    // 4. Cross-Contract: Escrow Integration
    function testEscrowIntegration() public {
        vm.prank(owner);
        listingManager.createListing(address(rentable), tokenId, 277777777777777, 3600, 86400, 0.1 ether, bytes32(0));

        vm.prank(renter);
        uint256 expectedCost = 277777777777777 * 3600; // Approximately 1 ether minus rounding
        uint256 expectedTotal = expectedCost + 0.1 ether;
        rentalManager.rent{value: expectedTotal}(
            address(rentable), tokenId, block.timestamp + 100, block.timestamp + 3700
        );

        // Funds in escrow
        assertEq(address(escrow).balance, expectedTotal);

        // After finalize
        vm.warp(block.timestamp + 3800);
        vm.prank(renter);
        rentalManager.finalize(1, address(rentable), tokenId);

        // Escrow empty
        assertEq(address(escrow).balance, 0);
    }

    // 5. Cross-Contract: Royalty on Transfer
    function testRoyaltyOnTransfer() public {
        // Mint another NFT for transfer test
        vm.prank(owner);
        rentable.mint(owner, 2);

        // Transfer and check royalty
        vm.prank(owner);
        rentable.transferFrom(owner, other, 2);

        // Royalty info: 5% to current owner (other)
        (address receiver, uint256 amount) = rentable.royaltyInfo(2, 10000);
        assertEq(receiver, other);
        assertEq(amount, 500); // 5% of 10000
    }

    // 5. End-to-End Rental Flow
    function testEndToEndRental() public {
        // Create listing
        vm.prank(owner);
        listingManager.createListing(address(rentable), tokenId, 277777777777777, 3600, 86400, 0, bytes32(0));

        // Rent NFT
        vm.prank(renter);
        rentalManager.rent{value: 1 ether}(address(rentable), tokenId, block.timestamp + 100, block.timestamp + 3700);

        // Verify rental
        assertEq(rentable.userOf(tokenId), renter);
    }

    // 6. Stress: Multiple Rentals on Different NFTs
    function testMultipleRentals() public {
        // Mint another NFT
        vm.prank(owner);
        rentable.mint(owner, 2);
        vm.prank(owner);
        rentable.setApprovalForAll(address(rentalManager), true);

        // List both
        vm.prank(owner);
        listingManager.createListing(address(rentable), tokenId, 277777777777777, 3600, 86400, 0, bytes32(0));
        vm.prank(owner);
        listingManager.createListing(address(rentable), 2, 277777777777777, 3600, 86400, 0, bytes32(0));

        // Rent both
        vm.prank(renter);
        rentalManager.rent{value: 1 ether}(address(rentable), tokenId, block.timestamp + 100, block.timestamp + 3700);
        vm.prank(other);
        rentalManager.rent{value: 1 ether}(address(rentable), 2, block.timestamp + 100, block.timestamp + 3700);

        // Check both rented
        assertEq(rentable.userOf(tokenId), renter);
        assertEq(rentable.userOf(2), other);
    }

    // 7. Error: Unauthorized Transfer During Rental
    function testTransferDuringRentalBlocked() public {
        vm.prank(owner);
        listingManager.createListing(address(rentable), tokenId, 277777777777777, 3600, 86400, 0, bytes32(0));

        vm.prank(renter);
        rentalManager.rent{value: 1 ether}(address(rentable), tokenId, block.timestamp + 100, block.timestamp + 3700);

        // Attempt transfer
        vm.prank(owner);
        vm.expectRevert("Rentable721: cannot transfer while rented");
        rentable.transferFrom(owner, other, tokenId);
    }
}
