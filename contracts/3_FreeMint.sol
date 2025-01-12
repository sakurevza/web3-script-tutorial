// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// try to frontrun a free mint tx
contract FreeMint is ERC721 {
    uint256 public totalSupply;

    // initialize the name and symbol of NFT collection
    constructor() ERC721("Free Mint NFT", "FreeMint"){}

    function mint() external {
        _mint(msg.sender, totalSupply); // mint
        totalSupply++;
    }
}