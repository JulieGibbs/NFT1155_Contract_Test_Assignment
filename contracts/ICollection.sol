// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ICollection {
    function mint(address to, uint256 id) external;

    function setBaseURI(string memory baseTokenURI) external;

    function setUnRevealedTokenURI(string memory unrevealedTokenURI) external;

    function setMaxSupply(uint256 maxSupply) external;

    function setRevealAt(uint256 revealAt) external;
}
