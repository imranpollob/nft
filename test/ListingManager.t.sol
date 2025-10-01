// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/ListingManager.sol";
import "../src/Rentable721.sol";

contract ListingManagerTest is Test {
    ListingManager manager;
    Rentable721 nft;
    address owner = address(1);
    address other = address(2);
    address newOwner = address(3);
    uint256 tokenId = 1;

    function setUp() public {
        vm.prank(owner);
        nft = new Rentable721();
        vm.prank(owner);
        nft.mint(owner, tokenId);

        manager = new ListingManager();
    }

    function testCreateListing() public {
        uint256 price = 1 ether;
        uint256 minDur = 3600;
        uint256 maxDur = 86400;
        uint256 deposit = 0.1 ether;
        bytes32 avail = keccak256("available");

        vm.prank(owner);
        vm.expectEmit(true, true, true, true);
        emit ListingManager.ListingCreated(address(nft), tokenId, owner, price, minDur, maxDur, deposit, avail, 1);
        manager.createListing(address(nft), tokenId, price, minDur, maxDur, deposit, avail);

        ListingManager.Listing memory listing = manager.getListing(address(nft), tokenId);
        assertEq(listing.owner, owner);
        assertEq(listing.pricePerSecond, price);
        assertEq(listing.minDuration, minDur);
        assertEq(listing.maxDuration, maxDur);
        assertEq(listing.deposit, deposit);
        assertEq(listing.availabilityHash, avail);
        assertTrue(listing.active);
        assertEq(listing.nonce, 1);
    }

    function testCreateListingNotOwner() public {
        vm.prank(other);
        vm.expectRevert("ListingManager: not owner");
        manager.createListing(address(nft), tokenId, 1 ether, 3600, 86400, 0, bytes32(0));
    }

    function testCreateListingAlreadyListed() public {
        vm.prank(owner);
        manager.createListing(address(nft), tokenId, 1 ether, 3600, 86400, 0, bytes32(0));

        vm.prank(owner);
        vm.expectRevert("ListingManager: already listed");
        manager.createListing(address(nft), tokenId, 1 ether, 3600, 86400, 0, bytes32(0));
    }

    function testCreateListingInvalidDurations() public {
        vm.prank(owner);
        vm.expectRevert("ListingManager: invalid durations");
        manager.createListing(address(nft), tokenId, 1 ether, 86400, 3600, 0, bytes32(0));
    }

    function testUpdateListing() public {
        vm.prank(owner);
        manager.createListing(address(nft), tokenId, 1 ether, 3600, 86400, 0, bytes32(0));

        uint256 newPrice = 2 ether;
        uint256 newMin = 7200;
        uint256 newMax = 172800;
        uint256 newDeposit = 0.2 ether;
        bytes32 newAvail = keccak256("new");

        vm.prank(owner);
        vm.expectEmit(true, true, true, true);
        emit ListingManager.ListingUpdated(
            address(nft), tokenId, owner, newPrice, newMin, newMax, newDeposit, newAvail, 2
        );
        manager.updateListing(address(nft), tokenId, newPrice, newMin, newMax, newDeposit, newAvail);

        ListingManager.Listing memory listing = manager.getListing(address(nft), tokenId);
        assertEq(listing.pricePerSecond, newPrice);
        assertEq(listing.minDuration, newMin);
        assertEq(listing.maxDuration, newMax);
        assertEq(listing.deposit, newDeposit);
        assertEq(listing.availabilityHash, newAvail);
        assertEq(listing.nonce, 2);
    }

    function testUpdateListingNotOwner() public {
        vm.prank(owner);
        manager.createListing(address(nft), tokenId, 1 ether, 3600, 86400, 0, bytes32(0));

        vm.prank(other);
        vm.expectRevert("ListingManager: not listing owner");
        manager.updateListing(address(nft), tokenId, 2 ether, 3600, 86400, 0, bytes32(0));
    }

    function testUpdateListingNotActive() public {
        vm.prank(owner);
        manager.createListing(address(nft), tokenId, 1 ether, 3600, 86400, 0, bytes32(0));

        vm.prank(owner);
        manager.cancelListing(address(nft), tokenId);

        vm.prank(owner);
        vm.expectRevert("ListingManager: not active");
        manager.updateListing(address(nft), tokenId, 2 ether, 3600, 86400, 0, bytes32(0));
    }

    function testCancelListing() public {
        vm.prank(owner);
        manager.createListing(address(nft), tokenId, 1 ether, 3600, 86400, 0, bytes32(0));

        vm.prank(owner);
        vm.expectEmit(true, true, true, true);
        emit ListingManager.ListingCanceled(address(nft), tokenId, owner, 2);
        manager.cancelListing(address(nft), tokenId);

        ListingManager.Listing memory listing = manager.getListing(address(nft), tokenId);
        assertFalse(listing.active);
        assertEq(listing.nonce, 2);
    }

    function testCancelListingNotOwner() public {
        vm.prank(owner);
        manager.createListing(address(nft), tokenId, 1 ether, 3600, 86400, 0, bytes32(0));

        vm.prank(other);
        vm.expectRevert("ListingManager: not listing owner");
        manager.cancelListing(address(nft), tokenId);
    }

    function testOwnershipChange() public {
        vm.prank(owner);
        manager.createListing(address(nft), tokenId, 1 ether, 3600, 86400, 0, bytes32(0));

        // Transfer NFT to newOwner
        vm.prank(owner);
        nft.transferFrom(owner, newOwner, tokenId);

        // Now newOwner is owner, but listing.owner is still old owner
        vm.prank(owner);
        vm.expectRevert("ListingManager: not current owner");
        manager.updateListing(address(nft), tokenId, 2 ether, 3600, 86400, 0, bytes32(0));
    }
}
