// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Treasury is Ownable2Step, ReentrancyGuard {

    using SafeERC20 for IERC20;

    // --------------------------------------------------
    // COLD WALLET
    // --------------------------------------------------

    // Permanent destination for Treasury withdrawals.
    // This address cannot be changed after deployment.
    address public immutable coldWallet;

    // --------------------------------------------------
    // EVENTS
    // --------------------------------------------------

    event ETHWithdrawn(
        address indexed coldWallet,
        uint256 amount
    );

    event TokenWithdrawn(
        address indexed token,
        address indexed coldWallet,
        uint256 amount
    );

    // --------------------------------------------------
    // CONSTRUCTOR
    // --------------------------------------------------

    constructor(
        address initialOwner,
        address coldWalletAddress
    )
        Ownable(initialOwner)
    {
        require(
            initialOwner != address(0),
            "Invalid owner"
        );

        require(
            coldWalletAddress != address(0),
            "Invalid cold wallet"
        );

        coldWallet =
            coldWalletAddress;
    }

    // --------------------------------------------------
    // RECEIVE ETH
    // --------------------------------------------------

    receive() external payable {}

    // --------------------------------------------------
    // WITHDRAW ETH
    // --------------------------------------------------

    function withdrawETH(
        uint256 amount
    )
        external
        onlyOwner
        nonReentrant
    {
        require(
            amount > 0,
            "Zero withdrawal"
        );

        require(
            address(this).balance >= amount,
            "Insufficient ETH"
        );

        payable(coldWallet).transfer(
            amount
        );

        emit ETHWithdrawn(
            coldWallet,
            amount
        );
    }

    // --------------------------------------------------
    // WITHDRAW ERC20
    // --------------------------------------------------

    function withdrawToken(
        address token,
        uint256 amount
    )
        external
        onlyOwner
        nonReentrant
    {
        require(
            token != address(0),
            "Invalid token"
        );

        require(
            amount > 0,
            "Zero withdrawal"
        );

        IERC20(token).safeTransfer(
            coldWallet,
            amount
        );

        emit TokenWithdrawn(
            token,
            coldWallet,
            amount
        );
    }

    // --------------------------------------------------
    // TOKEN BALANCE
    // --------------------------------------------------

    function tokenBalance(
        address token
    )
        external
        view
        returns (uint256)
    {
        require(
            token != address(0),
            "Invalid token"
        );

        return IERC20(token).balanceOf(
            address(this)
        );
    }

    // --------------------------------------------------
    // ETH BALANCE
    // --------------------------------------------------

    function ethBalance()
        external
        view
        returns (uint256)
    {
        return address(this).balance;
    }
}
