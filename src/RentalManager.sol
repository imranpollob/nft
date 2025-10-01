// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./Escrow.sol";
import "./ListingManager.sol";
import "./Rentable721.sol";

contract RentalManager is ReentrancyGuard {
    Escrow public escrow;
    ListingManager public listingManager;
    address public feeRecipient;
    uint256 public protocolFeeBps;
    uint256 public nextRentalId = 1;

    struct Rental {
        uint256 id;
        address renter;
        uint256 start;
        uint256 end;
        uint256 amount;
        uint256 deposit;
        bool finalized;
    }

    mapping(address => mapping(uint256 => Rental[])) public rentals;

    event Rented(
        uint256 indexed rentalId,
        address indexed nft,
        uint256 indexed tokenId,
        address renter,
        uint256 start,
        uint256 end,
        uint256 amount,
        uint256 deposit
    );
    event RentalFinalized(uint256 indexed rentalId, address indexed nft, uint256 indexed tokenId);
    event PayoutReleased(uint256 indexed rentalId, address indexed to, uint256 amount);
    event DepositRefunded(uint256 indexed rentalId, address indexed renter, uint256 amount);

    constructor(address _listingManager, address _feeRecipient, uint256 _protocolFeeBps) {
        listingManager = ListingManager(_listingManager);
        feeRecipient = _feeRecipient;
        protocolFeeBps = _protocolFeeBps;
        escrow = new Escrow(address(this));
    }

    function rent(address nft, uint256 tokenId, uint256 start, uint256 end) external payable nonReentrant {
        require(start < end && start >= block.timestamp, "RentalManager: invalid times");
        ListingManager.Listing memory listing = listingManager.getListing(nft, tokenId);
        require(listing.active, "RentalManager: not listed");
        require(listing.owner == IERC721(nft).ownerOf(tokenId), "RentalManager: ownership changed");
        uint256 duration = end - start;
        require(
            duration >= listing.minDuration && duration <= listing.maxDuration, "RentalManager: duration out of range"
        );
        uint256 cost = duration * listing.pricePerSecond;
        uint256 total = cost + listing.deposit;
        require(msg.value >= total, "RentalManager: insufficient payment");

        // Check overlaps
        Rental[] storage tokenRentals = rentals[nft][tokenId];
        for (uint256 i = 0; i < tokenRentals.length; i++) {
            if (tokenRentals[i].start < end && tokenRentals[i].end > start) {
                revert("RentalManager: time conflict");
            }
        }

        // Deposit only the required amount (cost + deposit)
        escrow.deposit{value: total}(nextRentalId);

        // Set user
        Rentable721(nft).setUser(tokenId, msg.sender, uint64(end));

        // Record
        Rental memory newRental = Rental({
            id: nextRentalId,
            renter: msg.sender,
            start: start,
            end: end,
            amount: cost,
            deposit: listing.deposit,
            finalized: false
        });
        tokenRentals.push(newRental);

        emit Rented(nextRentalId, nft, tokenId, msg.sender, start, end, cost, listing.deposit);
        nextRentalId++;

        // Refund excess
        if (msg.value > total) {
            (bool refundSuccess,) = payable(msg.sender).call{value: msg.value - total}("");
            require(refundSuccess, "RentalManager: refund failed");
        }
    }

    function getRentals(address nft, uint256 tokenId) external view returns (Rental[] memory) {
        return rentals[nft][tokenId];
    }

    function finalize(uint256 rentalId, address nft, uint256 tokenId) external nonReentrant {
        Rental[] storage tokenRentals = rentals[nft][tokenId];
        uint256 index = type(uint256).max;
        for (uint256 i = 0; i < tokenRentals.length; i++) {
            if (tokenRentals[i].id == rentalId) {
                index = i;
                break;
            }
        }
        require(index != type(uint256).max, "RentalManager: rental not found");
        Rental storage rental = tokenRentals[index];
        require(!rental.finalized, "RentalManager: already finalized");
        require(block.timestamp >= rental.end, "RentalManager: not expired");

        ListingManager.Listing memory listing = listingManager.getListing(nft, tokenId);
        uint256 fee = rental.amount * protocolFeeBps / 10000;
        uint256 toOwner = rental.amount - fee;

        if (toOwner > 0) {
            escrow.release(rentalId, listing.owner, toOwner);
            emit PayoutReleased(rentalId, listing.owner, toOwner);
        }
        if (fee > 0) escrow.release(rentalId, feeRecipient, fee);
        if (rental.deposit > 0) {
            escrow.release(rentalId, rental.renter, rental.deposit);
            emit DepositRefunded(rentalId, rental.renter, rental.deposit);
        }

        rental.finalized = true;
        emit RentalFinalized(rentalId, nft, tokenId);
    }
}
