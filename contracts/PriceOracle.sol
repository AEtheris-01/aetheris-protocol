// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

contract PriceOracle is Ownable {

    uint256 public ethPrice;
    uint256 public btcPrice;

    constructor(address initialOwner)
        Ownable(initialOwner)
    {}

    function setETHPrice(uint256 price)
        external
        onlyOwner
    {
        ethPrice = price;
    }

    function setBTCPrice(uint256 price)
        external
        onlyOwner
    {
        btcPrice = price;
    }

    function getETHPrice()
        external
        view
        returns(uint256)
    {
        return ethPrice;
    }

    function getBTCPrice()
        external
        view
        returns(uint256)
    {
        return btcPrice;
    }
}