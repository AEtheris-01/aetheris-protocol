// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Staking is Ownable {

    IERC20 public immutable token;

    mapping(address => uint256) public balances;

    uint256 public totalStaked;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    constructor(address tokenAddress, address initialOwner)
        Ownable(initialOwner)
    {
        token = IERC20(tokenAddress);
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");

        token.transferFrom(msg.sender, address(this), amount);

        balances[msg.sender] += amount;
        totalStaked += amount;

        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");

        balances[msg.sender] -= amount;
        totalStaked -= amount;

        token.transfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount);
    }
}