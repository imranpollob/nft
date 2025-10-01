// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/SubPass1155.sol";

contract SubPass1155Test is Test {
    SubPass1155 subPass;
    address owner = address(1);
    address user = address(2);
    address other = address(3);
    uint256 tier1 = 1;
    uint256 tier2 = 2;

    function setUp() public {
        vm.prank(owner);
        subPass = new SubPass1155("https://example.com/{id}.json");
    }

    function testMintOrRenewInitial() public {
        vm.prank(owner);
        subPass.mintOrRenew(user, tier1, 3600); // 1 hour
        assertEq(subPass.activeUntilOf(user, tier1), block.timestamp + 3600);
        assertTrue(subPass.isActive(user, tier1));
    }

    function testMintOrRenewExtend() public {
        vm.prank(owner);
        subPass.mintOrRenew(user, tier1, 3600);
        uint256 firstExpiry = block.timestamp + 3600;

        vm.warp(block.timestamp + 1800); // advance 30 min

        vm.prank(owner);
        subPass.mintOrRenew(user, tier1, 1800); // add 30 min
        uint256 expectedExpiry = firstExpiry + 1800;
        assertEq(subPass.activeUntilOf(user, tier1), expectedExpiry);
        assertTrue(subPass.isActive(user, tier1));
    }

    function testMintOrRenewAfterExpiry() public {
        vm.prank(owner);
        subPass.mintOrRenew(user, tier1, 3600);
        vm.warp(block.timestamp + 3601); // after expiry
        assertFalse(subPass.isActive(user, tier1));

        vm.prank(owner);
        subPass.mintOrRenew(user, tier1, 1800); // renew
        assertEq(subPass.activeUntilOf(user, tier1), block.timestamp + 1800);
        assertTrue(subPass.isActive(user, tier1));
    }

    function testMultipleTiers() public {
        vm.prank(owner);
        subPass.mintOrRenew(user, tier1, 3600);
        vm.prank(owner);
        subPass.mintOrRenew(user, tier2, 7200);

        assertTrue(subPass.isActive(user, tier1));
        assertTrue(subPass.isActive(user, tier2));
        assertEq(subPass.activeUntilOf(user, tier1), block.timestamp + 3600);
        assertEq(subPass.activeUntilOf(user, tier2), block.timestamp + 7200);
    }

    function testSoulboundTransferBlocked() public {
        vm.prank(owner);
        subPass.setSoulbound(tier1, true);
        vm.prank(owner);
        subPass.mintOrRenew(user, tier1, 3600);

        // Mint a token for transfer test
        vm.prank(owner);
        subPass.mint(user, tier1, 1, "");

        vm.prank(user);
        vm.expectRevert("SubPass1155: soulbound tier cannot be transferred");
        subPass.safeTransferFrom(user, other, tier1, 1, "");
    }

    function testNonSoulboundTransferAllowed() public {
        vm.prank(owner);
        subPass.mintOrRenew(user, tier2, 3600);

        // Mint a token
        vm.prank(owner);
        subPass.mint(user, tier2, 1, "");

        vm.prank(user);
        subPass.safeTransferFrom(user, other, tier2, 1, "");
        assertEq(subPass.balanceOf(other, tier2), 1);
    }

    function testBoundaryActiveJustBeforeExpiry() public {
        vm.prank(owner);
        subPass.mintOrRenew(user, tier1, 3600);
        vm.warp(block.timestamp + 3599); // 1 second before expiry
        assertTrue(subPass.isActive(user, tier1));
    }

    function testBoundaryActiveJustAfterExpiry() public {
        vm.prank(owner);
        subPass.mintOrRenew(user, tier1, 3600);
        vm.warp(block.timestamp + 3601); // 1 second after expiry
        assertFalse(subPass.isActive(user, tier1));
    }

    function testOnlyOwnerCanMintOrRenew() public {
        vm.prank(user);
        vm.expectRevert();
        subPass.mintOrRenew(user, tier1, 3600);
    }

    function testOnlyOwnerCanSetSoulbound() public {
        vm.prank(user);
        vm.expectRevert();
        subPass.setSoulbound(tier1, true);
    }
}
