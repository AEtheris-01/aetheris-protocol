// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract ProtocolFeeRouter is
    Ownable2Step,
    Pausable,
    ReentrancyGuard
{
    using SafeERC20 for IERC20;

    // --------------------------------------------------
    // CONSTANTS
    // --------------------------------------------------

    uint256 public constant BPS = 10_000;

    // Total protocol fee = 1%
    uint256 public constant TOTAL_FEE_BPS = 100;

    // 0.5% for AETR buyback/burn
    uint256 public constant AETR_FEE_BPS = 50;

    // 0.5% for BTC/WBTC treasury allocation
    uint256 public constant BTC_FEE_BPS = 50;

    // --------------------------------------------------
    // CONTRACT REFERENCES
    // --------------------------------------------------

    IERC20 public immutable ausd;
    IERC20 public immutable aetr;

    address public treasury;
    address public feeCollector;

    // --------------------------------------------------
    // ACCOUNTING
    // --------------------------------------------------

    uint256 public totalFeesReceived;
    uint256 public totalAETRAllocation;
    uint256 public totalBTCAllocation;

    // --------------------------------------------------
    // EVENTS
    // --------------------------------------------------

    event FeeReceived(
        address indexed payer,
        uint256 ausdAmount
    );

    event FeeAllocated(
        uint256 aetrAmount,
        uint256 btcAmount
    );

    event TreasuryUpdated(
        address indexed oldTreasury,
        address indexed newTreasury
    );

event FeeCollectorUpdated(
    address indexed oldCollector,
    address indexed newCollector
);

    // --------------------------------------------------
    // CONSTRUCTOR
    // --------------------------------------------------

    constructor(
        address initialOwner,
        address ausdAddress,
        address aetrAddress,
        address treasuryAddress
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
            aetrAddress != address(0),
            "Invalid AETR"
        );

        require(
            treasuryAddress != address(0),
            "Invalid treasury"
        );

        ausd =
            IERC20(ausdAddress);

        aetr =
            IERC20(aetrAddress);

        treasury =
            treasuryAddress;
    }

    // --------------------------------------------------
    // TREASURY
    // --------------------------------------------------

    function setTreasury(
        address newTreasury
    )
        external
        onlyOwner
    {
        require(
            newTreasury != address(0),
            "Invalid treasury"
        );

        address oldTreasury =
            treasury;

        treasury =
            newTreasury;

        emit TreasuryUpdated(
            oldTreasury,
            newTreasury
        );
    }

function setFeeCollector(
    address newCollector
)
    external
    onlyOwner
{
    require(
        newCollector != address(0),
        "Invalid collector"
    );

    address oldCollector =
        feeCollector;

    feeCollector =
        newCollector;

    emit FeeCollectorUpdated(
        oldCollector,
        newCollector
    );
}

    // --------------------------------------------------
    // FEE CALCULATION
    // --------------------------------------------------

    function calculateFee(
        uint256 ausdAmount
    )
        public
        pure
        returns (
            uint256 totalFee,
            uint256 aetrAllocation,
            uint256 btcAllocation
        )
    {
        require(
            ausdAmount > 0,
            "Zero amount"
        );

        totalFee =
            (ausdAmount * TOTAL_FEE_BPS)
            / BPS;

        aetrAllocation =
            (ausdAmount * AETR_FEE_BPS)
            / BPS;

        btcAllocation =
            (ausdAmount * BTC_FEE_BPS)
            / BPS;
    }

    // --------------------------------------------------
    // RECEIVE PROTOCOL FEE
    // --------------------------------------------------

    function receiveFee(
        address payer,
        uint256 ausdAmount
    )
        external
        whenNotPaused
        nonReentrant
    {

require(
    msg.sender == feeCollector,
    "Only fee collector"
);
        require(
            payer != address(0),
            "Invalid payer"
        );

        require(
            ausdAmount > 0,
            "Zero fee"
        );

        (
            uint256 totalFee,
            uint256 aetrAllocation,
            uint256 btcAllocation
        ) =
            calculateFee(ausdAmount);

require(
    ausd.balanceOf(address(this)) >=
        totalFee,
    "Insufficient fee balance"
);

        totalFeesReceived +=
            totalFee;

        totalAETRAllocation +=
            aetrAllocation;

        totalBTCAllocation +=
            btcAllocation;

        emit FeeReceived(
            payer,
            totalFee
        );

        emit FeeAllocated(
            aetrAllocation,
            btcAllocation
        );
    }

    // --------------------------------------------------
    // SEND BTC ALLOCATION TO TREASURY
    // --------------------------------------------------

    function transferBTCAllocation(
        uint256 amount
    )
        external
        onlyOwner
        whenNotPaused
        nonReentrant
    {
        require(
            amount > 0,
            "Zero amount"
        );

        require(
            amount <= totalBTCAllocation,
            "Exceeds BTC allocation"
        );

        totalBTCAllocation -=
            amount;

        ausd.safeTransfer(
            treasury,
            amount
        );
    }

    // --------------------------------------------------
    // AETR ALLOCATION
    // --------------------------------------------------

    function burnAETRAllocation(
        uint256 amount
    )
        external
        onlyOwner
        whenNotPaused
        nonReentrant
    {
        require(
            amount > 0,
            "Zero amount"
        );

        require(
            amount <= totalAETRAllocation,
            "Exceeds AETR allocation"
        );

        totalAETRAllocation -=
            amount;

        // AETR buyback/burn will be connected
        // through a dedicated execution module.
    }

    // --------------------------------------------------
    // PAUSE
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
