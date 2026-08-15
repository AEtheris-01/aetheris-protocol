// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";

interface IAUSDStablecoinV2 {
    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
}

interface IPriceOracleV2 {
    function getETHPrice() external view returns (uint256);
}

contract Vault is
    Ownable2Step,
    Pausable,
    ReentrancyGuard
{
    using Address for address payable;

    // --------------------------------------------------
    // CONSTANTS
    // --------------------------------------------------

    uint256 public constant BPS = 10_000;

    // Maximum borrowing = 66% of collateral value
    uint256 public constant MAX_LTV_BPS = 6_600;

    // --------------------------------------------------
    // USER POSITIONS
    // --------------------------------------------------

    mapping(address => uint256) public ethCollateral;
    mapping(address => uint256) public ausdDebt;

    uint256 public totalETHCollateral;
    uint256 public totalAUSDDebt;

    // --------------------------------------------------
    // CONTRACT REFERENCES
    // --------------------------------------------------

    IAUSDStablecoinV2 public immutable ausd;
    IPriceOracleV2 public immutable priceOracle;

    // --------------------------------------------------
    // EVENTS
    // --------------------------------------------------

    event ETHDeposited(
        address indexed user,
        uint256 amount
    );

    event ETHWithdrawn(
        address indexed user,
        uint256 amount
    );

    event AUSDBorrowed(
        address indexed user,
        uint256 amount
    );

    event AUSDRepaid(
        address indexed user,
        uint256 amount
    );

    // --------------------------------------------------
    // CONSTRUCTOR
    // --------------------------------------------------

    constructor(
        address initialOwner,
        address ausdAddress,
        address oracleAddress
    )
        Ownable(initialOwner)
    {
        require(
            initialOwner != address(0),
            "Invalid owner"
        );

        require(
            ausdAddress != address(0),
            "Invalid AUSD"
        );

        require(
            oracleAddress != address(0),
            "Invalid oracle"
        );

        ausd =
            IAUSDStablecoinV2(ausdAddress);

        priceOracle =
            IPriceOracleV2(oracleAddress);
    }

    // --------------------------------------------------
    // DEPOSIT ETH
    // --------------------------------------------------

    function depositETH()
        external
        payable
        whenNotPaused
        nonReentrant
    {
        require(
            msg.value > 0,
            "Zero deposit"
        );

        ethCollateral[msg.sender] +=
            msg.value;

        totalETHCollateral +=
            msg.value;

        emit ETHDeposited(
            msg.sender,
            msg.value
        );
    }

    // --------------------------------------------------
    // COLLATERAL VALUE
    // --------------------------------------------------

    function collateralValue(
        address user
    )
        public
        view
        returns (uint256)
    {
        uint256 ethPrice =
            priceOracle.getETHPrice();

        // Oracle prices use 8 decimals.
        // ETH collateral uses 18 decimals.
        // Result is USD/AUSD value with 18 decimals.

        return
            (ethCollateral[user] * ethPrice)
            / 1e8;
    }

    // --------------------------------------------------
    // MAXIMUM DEBT
    // --------------------------------------------------

    function maximumDebt(
        address user
    )
        public
        view
        returns (uint256)
    {
        return
            (collateralValue(user) *
                MAX_LTV_BPS)
            / BPS;
    }

    // --------------------------------------------------
    // AVAILABLE BORROW
    // --------------------------------------------------

    function maxBorrow(
        address user
    )
        public
        view
        returns (uint256)
    {
        uint256 maxDebt =
            maximumDebt(user);

        uint256 currentDebt =
            ausdDebt[user];

        if (currentDebt >= maxDebt) {
            return 0;
        }

        return maxDebt - currentDebt;
    }

    // --------------------------------------------------
    // BORROW AUSD
    // --------------------------------------------------

    function borrowAUSD(
        uint256 amount
    )
        external
        whenNotPaused
        nonReentrant
    {
        require(
            amount > 0,
            "Zero borrow"
        );

        require(
            amount <= maxBorrow(msg.sender),
            "Borrow exceeds collateral"
        );

        // Effects before external interaction
        ausdDebt[msg.sender] += amount;
        totalAUSDDebt += amount;

        // Vault must have AUSD MINTER_ROLE.
        ausd.mint(
            msg.sender,
            amount
        );

        emit AUSDBorrowed(
            msg.sender,
            amount
        );
    }

    // --------------------------------------------------
    // REPAY AUSD
    // --------------------------------------------------

    function repayAUSD(
        uint256 amount
    )
        external
        whenNotPaused
        nonReentrant
    {
        require(
            amount > 0,
            "Zero repayment"
        );

        uint256 debt =
            ausdDebt[msg.sender];

        require(
            amount <= debt,
            "Repay exceeds debt"
        );

        // Effects first. A revert from burn rolls
        // the entire transaction back atomically.
        ausdDebt[msg.sender] =
            debt - amount;

        totalAUSDDebt -= amount;

        // Vault must have AUSD BURNER_ROLE.
        ausd.burn(
            msg.sender,
            amount
        );

        emit AUSDRepaid(
            msg.sender,
            amount
        );
    }

    // --------------------------------------------------
    // WITHDRAW ETH
    // --------------------------------------------------

    function withdrawETH(
        uint256 amount
    )
        external
        whenNotPaused
        nonReentrant
    {
        require(
            amount > 0,
            "Zero withdrawal"
        );

        uint256 currentCollateral =
            ethCollateral[msg.sender];

        require(
            amount <= currentCollateral,
            "Insufficient collateral"
        );

        uint256 remainingCollateral =
            currentCollateral - amount;

        uint256 debt =
            ausdDebt[msg.sender];

        if (debt > 0) {
            uint256 ethPrice =
                priceOracle.getETHPrice();

            uint256 remainingValue =
                (remainingCollateral *
                    ethPrice)
                / 1e8;

            uint256 allowedDebt =
                (remainingValue *
                    MAX_LTV_BPS)
                / BPS;

            require(
                debt <= allowedDebt,
                "Withdrawal unsafe"
            );
        }

        // Effects before interaction
        ethCollateral[msg.sender] =
            remainingCollateral;

        totalETHCollateral -= amount;

        payable(msg.sender).sendValue(
            amount
        );

        emit ETHWithdrawn(
            msg.sender,
            amount
        );
    }

    // --------------------------------------------------
    // HEALTH
    // --------------------------------------------------

    function isHealthy(
        address user
    )
        external
        view
        returns (bool)
    {
        uint256 debt =
            ausdDebt[user];

        if (debt == 0) {
            return true;
        }

        return debt <= maximumDebt(user);
    }

    // --------------------------------------------------
    // EMERGENCY CONTROLS
    // --------------------------------------------------

    function pause()
        external
        onlyOwner
    {
        _pause();
    }

    function unpause()
        external
        onlyOwner
    {
        _unpause();
    }
}
