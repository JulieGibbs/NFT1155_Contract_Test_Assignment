// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Collection is ERC1155, Ownable {
    using Address for address;

    // Collection Base URI
    string private _baseTokenURI;

    // URI for unrevealed tokenIDs
    string private _unrevealedTokenURI;

    // Reveal Time
    uint256 private _revealAt;

    // Time record for NFT mint from certain account
    mapping(address => uint256) public mintedAt;

    // NFT holding of accounts: Checking for one user can mint one NFT
    mapping(address => bool) public mintedNFT;

    // Minted Token ID list to prevent remint through random mint
    mapping(uint256 => bool) public tokenIDMinted;

    // Max Token Supply
    uint256 public _maxSupply;

    constructor(
        string memory baseTokenURI,
        string memory unrevealedTokenURI,
        uint256 maxSupply,
        uint256 revealAt
    ) ERC1155(baseTokenURI) {
        _baseTokenURI = baseTokenURI;
        _unrevealedTokenURI = unrevealedTokenURI;
        _maxSupply = maxSupply;
        _revealAt = revealAt;
    }

    function setBaseURI(string memory baseTokenURI) public onlyOwner {
        _baseTokenURI = baseTokenURI;
    }

    function setUnRevealedTokenURI(string memory unrevealedTokenURI) public onlyOwner {
        _unrevealedTokenURI = unrevealedTokenURI;
    }

    function setMaxSupply(uint256 maxSupply) public onlyOwner {
        require(maxSupply > 0, "ZERO_MAX_SUPPLY");
        _maxSupply = maxSupply;
    }

    function setRevealAt(uint256 revealAt) public onlyOwner {
        require(revealAt > 0, "ZERO_VALUE");
        _revealAt = revealAt;
    }

    function mint(address to, uint256 id) public onlyOwner {
        // Check whether this account already have an NFT
        require(!mintedNFT[to], "ALREADY_MINTED_ACCOUNT");

        // Check whether tokenID is alrd minted
        require(!tokenIDMinted[id], "ALREADY_MINTED_TOKENID");

        // Check whether tokenID does not exceed the max supply
        require(id < _maxSupply, "EXCEED_MAX_SUPPLY");

        // Mint 1 NFT as default
        _mint(to, id, 1, "");

        // Update mintedNFT as true
        mintedNFT[to] = true;

        // Update NFT mint time
        mintedAt[to] = block.timestamp;

        // Update Token ID Minted
        tokenIDMinted[id] = true;
    }

    function tokenURI(uint256 id) public view returns (string memory) {
        if (!tokenIDMinted[id]) return _unrevealedTokenURI;
        
        if (_revealAt < block.timestamp) {
            return string(abi.encodePacked(_baseTokenURI, Strings.toString(id), ".json"));
        } else {
            return _unrevealedTokenURI;
        }
    }
}
