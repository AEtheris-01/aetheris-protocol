// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract PriceOracle is Ownable2Step, Pausable {

    // --------------------------------------------------
    // PRICE DATA
    // --------------------------------------------------

    struct PriceData {
        uint256 price;
        uint256 updatedAt;
    }

    PriceData private ethPriceData;
    PriceData private btcPriceData;
    PriceData private aetrPriceData;

    // --------------------------------------------------
    // PRICE CONFIGURATION
    // --------------------------------------------------

    uint256 public constant MIN_PRICE_AGE = 5 minutes;
    uint256 public constant MAX_PRICE_AGE_LIMIT = 24 hours;

    uint256 public maxPriceAge = 1 hours;

    // --------------------------------------------------
    // PRICE UPDATER
    // --------------------------------------------------

    address public priceUpdater;

    // --------------------------------------------------
    // EVENTS
    // --------------------------------------------------

    event PriceUpdaterUpdated(
        address indexed oldUpdater,
        address indexed newUpdater
    );

    event MaxPriceAgeUpdated(
        uint256 oldAge,
        uint256 newAge
    );

    event ETHPriceUpdated(
        uint256 price,
        uint256 timestamp
    );

    event BTCPriceUpdated(
        uint256 price,
        uint256 timestamp
    );

    event AETRPriceUpdated(
        uint256 price,
        uint256 timestamp
    );

    // --------------------------------------------------
    // CONSTRUCTOR
    // --------------------------------------------------

    constructor(
        address initialOwner
    )
        Ownable(initialOwner)
    {
        require(
            initialOwner != address(0),
            "Invalid owner"
        );

        priceUpdater = initialOwner;

        emit PriceUpdaterUpdated(
            address(0),
            initialOwner
        );
    }

    // --------------------------------------------------
    // MODIFIERS
    // --------------------------------------------------

    modifier onlyPriceUpdater() {
        require(
            msg.sender == priceUpdater,
            "Only price updater"
        );
        _;
    }

    // --------------------------------------------------
    // ADMIN
    // --------------------------------------------------

    function setPriceUpdater(
        address newUpdater
    )
        external
        onlyOwner
    {
        require(
            newUpdater != address(0),
            "Invalid updater"
        );

        address oldUpdater = priceUpdater;

        priceUpdater = newUpdater;

        emit PriceUpdaterUpdated(
            oldUpdater,
            newUpdater
        );
    }

    function setMaxPriceAge(
        uint256 newAge
    )
        external
        onlyOwner
    {
        require(
            newAge >= MIN_PRICE_AGE,
            "Price age too short"
        );

        require(
            newAge <= MAX_PRICE_AGE_LIMIT,
            "Price age too long"
        );

        uint256 oldAge = maxPriceAge;

        maxPriceAge = newAge;

        emit MaxPriceAgeUpdated(
            oldAge,
            newAge
        );
    }

    // --------------------------------------------------
    // ETH PRICE
    // --------------------------------------------------

    function setETHPrice(
        uint256 price
    )
        external
        onlyPriceUpdater
        whenNotPaused
    {
        require(
            price > 0,
            "Invalid ETH price"
        );

        ethPriceData = PriceData({
            price: price,
            updatedAt: block.timestamp
        });

        emit ETHPriceUpdated(
            price,
            block.timestamp
        );
    }

    function getETHPrice()
        external
        view
        returns (uint256)
    {
        require(
            !paused(),
            "Oracle paused"
        );

        return _getFreshPrice(
            ethPriceData
        );
    }

    function getETHPriceData()
        external
        view
        returns (
            uint256 price,
            uint256 updatedAt
        )
    {
        require(
            !paused(),
            "Oracle paused"
        );

        _requireFresh(
            ethPriceData
        );

        return (
            ethPriceData.price,
            ethPriceData.updatedAt
        );
    }

    // --------------------------------------------------
    // BTC PRICE
    // --------------------------------------------------

    function setBTCPrice(
        uint256 price
    )
        external
        onlyPriceUpdater
        whenNotPaused
    {
        require(
            price > 0,
            "Invalid BTC price"
        );

        btcPriceData = PriceData({
            price: price,
            updatedAt: block.timestamp
        });

        emit BTCPriceUpdated(
            price,
            block.timestamp
        );
    }

    function getBTCPrice()
        external
        view
        returns (uint256)
    {
        require(
            !paused(),
            "Oracle paused"
        );

        return _getFreshPrice(
            btcPriceData
        );
    }

    function getBTCPriceData()
        external
        view
        returns (
            uint256 price,
            uint256 updatedAt
        )
    {
        require(
            !paused(),
            "Oracle paused"
        );

        _requireFresh(
            btcPriceData
        );

        return (
            btcPriceData.price,
            btcPriceData.updatedAt
        );
    }

    // --------------------------------------------------
    // AETR PRICE
    // --------------------------------------------------

    function setAETRPrice(
        uint256 price
    )
        external
        onlyPriceUpdater
        whenNotPaused
    {
        require(
            price > 0,
            "Invalid AETR price"
        );

        aetrPriceData = PriceData({
            price: price,
            updatedAt: block.timestamp
        });

        emit AETRPriceUpdated(
            price,
            block.timestamp
        );
    }

    function getAETRPrice()
        external
        view
        returns (uint256)
    {
        require(
            !paused(),
            "Oracle paused"
        );

        return _getFreshPrice(
            aetrPriceData
        );
    }

    function getAETRPriceData()
        external
        view
        returns (
            uint256 price,
            uint256 updatedAt
        )
    {
        require(
            !paused(),
            "Oracle paused"
        );

        _requireFresh(
            aetrPriceData
        );

        return (
            aetrPriceData.price,
            aetrPriceData.updatedAt
        );
    }

    // --------------------------------------------------
    // FRESHNESS VALIDATION
    // --------------------------------------------------

    function isFresh(
        uint256 updatedAt
    )
        public
        view
        returns (bool)
    {
        if (updatedAt == 0) {
            return false;
        }

        if (updatedAt > block.timestamp) {
            return false;
        }

        return (
            block.timestamp - updatedAt
        ) <= maxPriceAge;
    }

    function _requireFresh(
        PriceData memory data
    )
        internal
        view
    {
        require(
            data.price > 0,
            "Price unavailable"
        );

        require(
            isFresh(data.updatedAt),
            "Price is stale"
        );
    }

    function _getFreshPrice(
        PriceData memory data
    )
        internal
        view
        returns (uint256)
    {
        _requireFresh(data);

        return data.price;
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
