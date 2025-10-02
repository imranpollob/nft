// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

interface IERC4907 {
    event UpdateUser(uint256 indexed tokenId, address indexed user, uint64 expires);

    function setUser(uint256 tokenId, address user, uint64 expires) external;

    function userOf(uint256 tokenId) external view returns (address);

    function userExpires(uint256 tokenId) external view returns (uint256);
}

contract Rentable721 is ERC721, Ownable, IERC4907, IERC2981 {
    struct UserInfo {
        address user;
        uint64 expires;
    }

    mapping(uint256 => UserInfo) private _users;
    address public marketplace;

    // Token metadata
    mapping(uint256 => string) private _tokenNames;
    mapping(uint256 => string) private _tokenDescriptions;
    mapping(uint256 => string) private _tokenImages;
    mapping(uint256 => string) private _tokenCollections;

    constructor() ERC721("RentableNFT", "RNFT") Ownable(msg.sender) {}

    function setMarketplace(address _marketplace) external onlyOwner {
        marketplace = _marketplace;
    }

    function setUser(uint256 tokenId, address user, uint64 expires) external override {
        require(msg.sender == marketplace, "Rentable721: only marketplace can set user");
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

    function mintWithMetadata(
        address to,
        uint256 tokenId,
        string memory name,
        string memory description,
        string memory image,
        string memory collection
    ) external onlyOwner {
        _mint(to, tokenId);
        _tokenNames[tokenId] = name;
        _tokenDescriptions[tokenId] = description;
        _tokenImages[tokenId] = image;
        _tokenCollections[tokenId] = collection;
    }

    function getTokenMetadata(uint256 tokenId)
        external
        view
        returns (string memory name, string memory description, string memory image, string memory collection)
    {
        return (_tokenNames[tokenId], _tokenDescriptions[tokenId], _tokenImages[tokenId], _tokenCollections[tokenId]);
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

    // ERC2981 Royalty
    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        view
        override
        returns (address receiver, uint256 royaltyAmount)
    {
        require(_ownerOf(tokenId) != address(0), "Rentable721: token does not exist");
        return (ownerOf(tokenId), salePrice * 500 / 10000); // 5% royalty to owner
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, IERC165) returns (bool) {
        return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
    }
}
