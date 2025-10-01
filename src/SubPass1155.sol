// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SubPass1155 is ERC1155, Ownable {
    mapping(address => mapping(uint256 => uint256)) public activeUntil; // user => tierId => expiry timestamp
    mapping(uint256 => bool) public soulbound; // tierId => is soulbound

    event MembershipExtended(address indexed user, uint256 indexed tierId, uint256 newExpiry);

    constructor(string memory uri) ERC1155(uri) Ownable(msg.sender) {}

    function mintOrRenew(address to, uint256 tierId, uint256 seconds_) external onlyOwner {
        uint256 currentExpiry = activeUntil[to][tierId];
        uint256 newExpiry = currentExpiry > block.timestamp ? currentExpiry + seconds_ : block.timestamp + seconds_;
        activeUntil[to][tierId] = newExpiry;
        emit MembershipExtended(to, tierId, newExpiry);
    }

    function isActive(address addr, uint256 tierId) external view returns (bool) {
        return activeUntil[addr][tierId] > block.timestamp;
    }

    function activeUntilOf(address addr, uint256 tierId) external view returns (uint256) {
        return activeUntil[addr][tierId];
    }

    function setSoulbound(uint256 tierId, bool _soulbound) external onlyOwner {
        soulbound[tierId] = _soulbound;
    }

    function mint(address to, uint256 id, uint256 amount, bytes memory data) external onlyOwner {
        _mint(to, id, amount, data);
    }

    // Override _update to block transfers for soulbound tiers
    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        virtual
        override
    {
        for (uint256 i = 0; i < ids.length; i++) {
            if (soulbound[ids[i]] && from != address(0) && to != address(0)) {
                revert("SubPass1155: soulbound tier cannot be transferred");
            }
        }
        super._update(from, to, ids, values);
    }
}
