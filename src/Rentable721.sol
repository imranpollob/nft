// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IERC4907 {
    event UpdateUser(uint256 indexed tokenId, address indexed user, uint64 expires);

    function setUser(uint256 tokenId, address user, uint64 expires) external;

    function userOf(uint256 tokenId) external view returns (address);

    function userExpires(uint256 tokenId) external view returns (uint256);
}

contract Rentable721 is ERC721, Ownable, IERC4907 {
    struct UserInfo {
        address user;
        uint64 expires;
    }

    mapping(uint256 => UserInfo) private _users;

    constructor() ERC721("RentableNFT", "RNFT") Ownable(msg.sender) {}

    function setUser(uint256 tokenId, address user, uint64 expires) external override {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Rentable721: caller is not owner nor approved");
        if (user != address(0)) {
            require(expires > block.timestamp, "Rentable721: expires must be in the future");
        }
        _users[tokenId] = UserInfo(user, expires);
        emit UpdateUser(tokenId, user, expires);
    }

    function userOf(uint256 tokenId) public view override returns (address) {
        if (_users[tokenId].expires <= block.timestamp) {
            return address(0);
        }
        return _users[tokenId].user;
    }

    function userExpires(uint256 tokenId) external view override returns (uint256) {
        return _users[tokenId].expires;
    }

    function mint(address to, uint256 id) external onlyOwner {
        _mint(to, id);
    }

    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        address owner = ownerOf(tokenId);
        return (spender == owner || isApprovedForAll(owner, spender) || getApproved(tokenId) == spender);
    }

    // Transfer guard: block transfer while active rental
    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        require(userOf(tokenId) == address(0), "Rentable721: cannot transfer while rented");
        return super._update(to, tokenId, auth);
    }
}
