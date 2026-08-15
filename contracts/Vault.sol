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

interface IProtocolFeeRouterV2 {
    function calculateFee(
        uint256 ausdAmount
    )
        external
        pure
        returns (
            uint256 totalFee,
            uint256 aetrAllocation,
            uint256 btcAllocation
        );

    function receiveFee(
        address payer,
        uint256 ausdAmount
    ) external;
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

    // Liquidation starts at 75% LTV
    uint256 public constant LIQUIDATION_THRESHOLD_BPS = 7_500;

    // Liquidator receives a 5% collateral bonus
    uint256 public constant LIQUIDATION_BONUS_BPS = 500;

    // Maximum 50% of outstanding debt per liquidation
    uint256 public constant MAX_LIQUIDATION_CLOSE_FACTOR_BPS = 5_000;

    // Protocol fee = 1% of requested AUSD borrow
    uint256 public constant BORROW_FEE_BPS = 100;

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

    IProtocolFeeRouterV2 public feeRouter;

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

    event Liquidated(
        address indexed user,
        address indexed liquidator,
        uint256 debtRepaid,
        uint256 collateralSeized
    );

    event FeeRouterUpdated(
        address indexed oldRouter,
        address indexed newRouter
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
    // FEE ROUTER
    // --------------------------------------------------

    function setFeeRouter(
        address newFeeRouter
    )
        external
        onlyOwner
    {
        require(
            newFeeRouter != address(0),
            "Invalid fee router"
        );

        address oldRouter =
            address(feeRouter);

        feeRouter =
            IProtocolFeeRouterV2(
                newFeeRouter
            );

        emit FeeRouterUpdated(
            oldRouter,
            newFeeRouter
        );
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

        require(
            address(feeRouter) != address(0),
            "Fee router not configured"
        );

        // --------------------------------------------------
        // CALCULATE PROTOCOL FEE
        // --------------------------------------------------

        (
            uint256 totalFee,
            ,
        ) =
            feeRouter.calculateFee(
                amount
            );

        require(
            totalFee > 0,
            "Fee too small"
        );

        // Ensure the router calculation remains
        // consistent with the Vault's protocol rule.
        require(
            totalFee ==
                (amount * BORROW_FEE_BPS) / BPS,
            "Invalid fee"
        );

        // --------------------------------------------------
        // EFFECTS
        // --------------------------------------------------

        // User debt is ONLY the amount requested.
        // Protocol fee is NOT added to user debt.

        ausdDebt[msg.sender] +=
            amount;

        totalAUSDDebt +=
            amount;

        // --------------------------------------------------
        // MINT USER AUSD
        // --------------------------------------------------

        ausd.mint(
            msg.sender,
            amount
        );

        // --------------------------------------------------
        // MINT PROTOCOL FEE
        // --------------------------------------------------

        // Fee is minted directly to the FeeRouter.
        // It never enters the user's balance.

        ausd.mint(
            address(feeRouter),
            totalFee
        );

        // --------------------------------------------------
        // REGISTER PROTOCOL FEE
        // --------------------------------------------------

        feeRouter.receiveFee(
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

        // Effects first.
        // A revert from burn rolls the entire
        // transaction back atomically.

        ausdDebt[msg.sender] =
            debt - amount;

        totalAUSDDebt -=
            amount;

        // Vault must possess AUSD BURNER_ROLE.
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
    // LIQUIDATION
    // --------------------------------------------------

    function liquidate(
        address user,
        uint256 debtToRepay
    )
        external
        whenNotPaused
        nonReentrant
    {
        require(
            user != address(0),
            "Invalid user"
        );

        require(
            debtToRepay > 0,
            "Zero liquidation"
        );

        uint256 userDebt =
            ausdDebt[user];

        require(
            userDebt > 0,
            "No debt"
        );

        uint256 collateralUSD =
            collateralValue(user);

        require(
            collateralUSD > 0,
            "No collateral"
        );

        // Position must be at or above
        // the liquidation threshold.

        require(
            userDebt * BPS >=
                collateralUSD *
                LIQUIDATION_THRESHOLD_BPS,
            "Position healthy"
        );

        // Maximum 50% of debt per liquidation.

        uint256 maxRepay =
            (userDebt *
                MAX_LIQUIDATION_CLOSE_FACTOR_BPS)
            / BPS;

        require(
            maxRepay > 0,
            "Liquidation amount too small"
        );

        require(
            debtToRepay <= maxRepay,
            "Close factor exceeded"
        );

        uint256 ethPrice =
            priceOracle.getETHPrice();

        require(
            ethPrice > 0,
            "Invalid ETH price"
        );

        // --------------------------------------------------
        // COLLATERAL SEIZED
        //
        // debtToRepay is denominated in USD/AUSD
        // with 18 decimals.
        //
        // ethPrice has 8 decimals.
        // --------------------------------------------------

        uint256 collateralSeized =
            (
                debtToRepay *
                (BPS + LIQUIDATION_BONUS_BPS) *
                1e8
            )
            / ethPrice
            / BPS;

        require(
            collateralSeized > 0,
            "Collateral too small"
        );

        require(
            collateralSeized <=
                ethCollateral[user],
            "Insufficient collateral"
        );

        // --------------------------------------------------
        // EFFECTS
        // --------------------------------------------------

        ausdDebt[user] =
            userDebt - debtToRepay;

        totalAUSDDebt -=
            debtToRepay;

        ethCollateral[user] -=
            collateralSeized;

        totalETHCollateral -=
            collateralSeized;

        // --------------------------------------------------
        // INTERACTIONS
        // --------------------------------------------------

        // Liquidator must possess the AUSD being repaid.
        // Vault must possess BURNER_ROLE.

        ausd.burn(
            msg.sender,
            debtToRepay
        );

        payable(msg.sender).sendValue(
            collateralSeized
        );

        emit Liquidated(
            user,
            msg.sender,
            debtToRepay,
            collateralSeized
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

        totalETHCollateral -=
            amount;

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
