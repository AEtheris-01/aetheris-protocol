// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Treasury is Ownable {

    constructor(address initialOwner)
        Ownable(initialOwner)
    {}

    // --------------------------------------------------
    // RECEIVE ETH
    // --------------------------------------------------

    receive() external payable {}

    // --------------------------------------------------
    // WITHDRAW ETH
    // --------------------------------------------------

    function withdrawETH(
        address payable to,
        uint256 amount
    ) external onlyOwner {

        require(
            to != address(0),
            "Invalid recipient"
        );

        require(
            address(this).balance >= amount,
            "Insufficient ETH"
        );

        to.transfer(amount);
    }

    // --------------------------------------------------
    // WITHDRAW ERC20
    // --------------------------------------------------

    function withdrawToken(
        address token,
        address to,
        uint256 amount
    ) external onlyOwner {

        require(
            token != address(0),
            "Invalid token"
        );

        require(
            to != address(0),
            "Invalid recipient"
        );

        IERC20(token).transfer(
            to,
            amount
        );
    }

    // --------------------------------------------------
    // TOKEN BALANCE
    // --------------------------------------------------

    function tokenBalance(
        address token
    ) external view returns (uint256) {

        return IERC20(token).balanceOf(
            address(this)
        );
    }
}
