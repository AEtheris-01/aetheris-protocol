// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IAUSDStablecoin {
    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
}

interface IPriceOracle {
    function getETHPrice() external view returns (uint256);
}

contract Vault is Ownable {

    // --------------------------------------------------
    // USER POSITIONS
    // --------------------------------------------------

    mapping(address => uint256) public ethCollateral;
    mapping(address => uint256) public ausdDebt;

    // --------------------------------------------------
    // CONTRACT REFERENCES
    // --------------------------------------------------

    IAUSDStablecoin public ausd;
    IPriceOracle public priceOracle;

    // --------------------------------------------------
    // RISK PARAMETERS
    // --------------------------------------------------

    // Maximum LTV = 66%
    uint256 public constant MAX_LTV_BPS = 6600;
    uint256 public constant BPS = 10000;

    // --------------------------------------------------
    // MINTING FEE
    // --------------------------------------------------

    // Minimum = 0.50%
    uint256 public constant MIN_MINT_FEE_BPS = 50;

    // Maximum = 1.00%
    uint256 public constant MAX_MINT_FEE_BPS = 100;

    // Initial fee = 0.50%
    uint256 public mintFeeBps = 50;

    // AUSD fee recipient
    address public feeTreasury;

    // --------------------------------------------------
    // EVENTS
    // --------------------------------------------------

    event Deposit(
        address indexed user,
        uint256 amount
    );

    event Withdraw(
        address indexed user,
        uint256 amount
    );

    event Borrow(
        address indexed user,
        uint256 amount
    );

    event Repay(
        address indexed user,
        uint256 amount
    );

    event MintFeeUpdated(
        uint256 oldFeeBps,
        uint256 newFeeBps
    );

    event FeeTreasuryUpdated(
        address indexed oldTreasury,
        address indexed newTreasury
    );

    event MintFeeCollected(
        address indexed user,
        address indexed treasury,
        uint256 principal,
        uint256 fee
    );

    // --------------------------------------------------
    // CONSTRUCTOR
    // --------------------------------------------------

    constructor(
        address initialOwner,
        address ausdAddress,
        address oracleAddress
    ) Ownable(initialOwner) {
        ausd = IAUSDStablecoin(ausdAddress);
        priceOracle = IPriceOracle(oracleAddress);
    }

    // --------------------------------------------------
    // MINT FEE ADMINISTRATION
    // --------------------------------------------------

    function setMintFeeBps(
        uint256 newFeeBps
    ) external onlyOwner {

        require(
            newFeeBps >= MIN_MINT_FEE_BPS &&
            newFeeBps <= MAX_MINT_FEE_BPS,
            "Fee outside allowed range"
        );

        uint256 oldFeeBps = mintFeeBps;

        mintFeeBps = newFeeBps;

        emit MintFeeUpdated(
            oldFeeBps,
            newFeeBps
        );
    }

    function setFeeTreasury(
        address newTreasury
    ) external onlyOwner {

        require(
            newTreasury != address(0),
            "Invalid treasury"
        );

        address oldTreasury = feeTreasury;

        feeTreasury = newTreasury;

        emit FeeTreasuryUpdated(
            oldTreasury,
            newTreasury
        );
    }

    // --------------------------------------------------
    // DEPOSIT ETH
    // --------------------------------------------------

    function depositETH() external payable {

        require(
            msg.value > 0,
            "Zero deposit"
        );

        ethCollateral[msg.sender] += msg.value;

        emit Deposit(
            msg.sender,
            msg.value
        );
    }

    // --------------------------------------------------
    // GET ETH PRICE
    // --------------------------------------------------

    function getETHPrice()
        public
        view
        returns (uint256)
    {
        return priceOracle.getETHPrice();
    }

    // --------------------------------------------------
    // GET COLLATERAL VALUE
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

        require(
            ethPrice > 0,
            "ETH price not set"
        );

        // ETH = 18 decimals
        // Price = 8 decimals
        // Result = USD with 18 decimals

        return
            (ethCollateral[user] * ethPrice)
            / 1e8;
    }

    // --------------------------------------------------
    // MAXIMUM AUSD BORROWING CAPACITY
    // --------------------------------------------------

    function maxBorrow(
        address user
    )
        public
        view
        returns (uint256)
    {
        uint256 collateralUSD =
            collateralValue(user);

        uint256 maximumDebt =
            (collateralUSD * MAX_LTV_BPS)
            / BPS;

        if (
            maximumDebt <= ausdDebt[user]
        ) {
            return 0;
        }

        return
            maximumDebt - ausdDebt[user];
    }

    // --------------------------------------------------
    // BORROW AUSD
    // --------------------------------------------------

    function borrowAUSD(
        uint256 amount
    )
        external
    {
        require(
            amount > 0,
            "Zero borrow"
        );

        uint256 available =
            maxBorrow(msg.sender);

        require(
            amount <= available,
            "Borrow exceeds collateral"
        );

        require(
            feeTreasury != address(0),
            "Fee treasury not set"
        );

        // Calculate minting fee
        uint256 fee =
            (amount * mintFeeBps)
            / BPS;

        // User debt is ONLY the requested principal
        ausdDebt[msg.sender] += amount;

        // User receives requested AUSD
        ausd.mint(
            msg.sender,
            amount
        );

        // Treasury receives the fee
        ausd.mint(
            feeTreasury,
            fee
        );

        emit Borrow(
            msg.sender,
            amount
        );

        emit MintFeeCollected(
            msg.sender,
            feeTreasury,
            amount,
            fee
        );
    }

    // --------------------------------------------------
    // REPAY AUSD
    // --------------------------------------------------

    function repayAUSD(
        uint256 amount
    )
        external
    {
        require(
            amount > 0,
            "Zero repayment"
        );

        require(
            amount <= ausdDebt[msg.sender],
            "Repay exceeds debt"
        );

        // Burn ONLY the principal debt
        ausd.burn(
            msg.sender,
            amount
        );

        ausdDebt[msg.sender] -= amount;

        emit Repay(
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
    {
        require(
            amount > 0,
            "Zero withdrawal"
        );

        require(
            ethCollateral[msg.sender] >= amount,
            "Insufficient collateral"
        );

        uint256 remainingCollateral =
            ethCollateral[msg.sender] - amount;

        uint256 ethPrice =
            priceOracle.getETHPrice();

        require(
            ethPrice > 0,
            "ETH price not set"
        );

        uint256 remainingValue =
            (remainingCollateral * ethPrice)
            / 1e8;

        uint256 requiredCollateral =
            (ausdDebt[msg.sender] * BPS)
            / MAX_LTV_BPS;

        require(
            remainingValue >= requiredCollateral,
            "Withdrawal would undercollateralize"
        );

        ethCollateral[msg.sender] =
            remainingCollateral;

        payable(msg.sender).transfer(
            amount
        );

        emit Withdraw(
            msg.sender,
            amount
        );
    }

    // --------------------------------------------------
    // VIEW FUNCTIONS
    // --------------------------------------------------

    function collateralOf(
        address user
    )
        external
        view
        returns (uint256)
    {
        return ethCollateral[user];
    }

    function debtOf(
        address user
    )
        external
        view
        returns (uint256)
    {
        return ausdDebt[user];
    }
}
