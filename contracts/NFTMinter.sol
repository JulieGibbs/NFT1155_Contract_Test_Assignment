// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./ICollection.sol";

contract NFTMinter is Ownable, ReentrancyGuard {
    // NFT collection address
    address public collection;

    // NFT Mint floor price
    uint256 public price;

    receive() external payable {}

    event NFTMint(address to, uint256 id, uint256 price);

    event SetPrice(uint256 price);

    event Withdraw(address to, uint256 amount);

    constructor(address _collection, uint256 _price) {
        price = _price;
        collection = _collection;
    }

    function mint(address to, uint256 id) public payable nonReentrant {
        require(msg.value >= price, "INSUFFICIENT_TRANSFER");

        ICollection(collection).mint(to, id);

        emit NFTMint(to, id, price);
    }

    function setPrice(uint256 _price) public onlyOwner {
        require(_price > 0, "ZERO_PRICE");

        price = _price;

        emit SetPrice(price);
    }

    /**
        Collection setting functions, needed after transfer ownership from collection to minter
     */

    function setBaseURI(string memory baseTokenURI) public onlyOwner {
        ICollection(collection).setBaseURI(baseTokenURI);
    }

    function setUnRevealedTokenURI(string memory unrevealedTokenURI) public onlyOwner {
        ICollection(collection).setUnRevealedTokenURI(unrevealedTokenURI);
    }

    function setMaxSupply(uint256 maxSupply) public onlyOwner {
        ICollection(collection).setMaxSupply(maxSupply);
    }

    function setRevealAt(uint256 revealAt) public onlyOwner {
        ICollection(collection).setRevealAt(revealAt);
    }

    function withdraw(address account) public onlyOwner {
        require(account != address(0), "CAN NOT WITHDRAW TO ZERO ADDRESS");
        uint256 balance = address(this).balance;

        require(balance > 0, "CAN NOT WITHDRAW ZERO BALANCE");

        account.call{value: balance}(new bytes(0));

        emit Withdraw(account, balance);
    }
}
