// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";

contract AETRToken is ERC20, Ownable2Step {

    // --------------------------------------------------
    // SUPPLY
    // --------------------------------------------------

    uint256 public constant MAX_SUPPLY =
        1_000_000_000 * 10 ** 18;

    uint256 public constant INITIAL_SUPPLY =
        300_000_000 * 10 ** 18;

    // --------------------------------------------------
    // ALLOCATION
    // --------------------------------------------------

    uint256 public constant HOLDER_REWARD_ALLOCATION =
        100_000_000 * 10 ** 18;

    uint256 public constant VAULT_INCENTIVE_ALLOCATION =
        100_000_000 * 10 ** 18;

    uint256 public constant AIRDROP_ALLOCATION =
        50_000_000 * 10 ** 18;

    uint256 public constant TREASURY_ALLOCATION =
        50_000_000 * 10 ** 18;

    // --------------------------------------------------
    // FUTURE EMISSION
    // --------------------------------------------------

    uint256 public constant FUTURE_EMISSION =
        MAX_SUPPLY - INITIAL_SUPPLY;

    // --------------------------------------------------
    // AUTHORIZED EMITTER
    // --------------------------------------------------

    address public emissionController;

    uint256 public totalFutureMinted;

    // --------------------------------------------------
    // EVENTS
    // --------------------------------------------------

    event EmissionControllerUpdated(
        address indexed oldController,
        address indexed newController
    );

    event FutureEmissionMinted(
        address indexed to,
        uint256 amount
    );

    // --------------------------------------------------
    // CONSTRUCTOR
    // --------------------------------------------------

    constructor(
        address initialOwner,
        address holderRewardReserve,
        address vaultIncentiveReserve,
        address airdropReserve,
        address treasuryReserve
    )
        ERC20("AETHERIS Token", "AETR")
        Ownable(initialOwner)
    {
        require(
            initialOwner != address(0),
            "Invalid owner"
        );

        require(
            holderRewardReserve != address(0),
            "Invalid reward reserve"
        );

        require(
            vaultIncentiveReserve != address(0),
            "Invalid vault reserve"
        );

        require(
            airdropReserve != address(0),
            "Invalid airdrop reserve"
        );

        require(
            treasuryReserve != address(0),
            "Invalid treasury reserve"
        );

        _mint(
            holderRewardReserve,
            HOLDER_REWARD_ALLOCATION
        );

        _mint(
            vaultIncentiveReserve,
            VAULT_INCENTIVE_ALLOCATION
        );

        _mint(
            airdropReserve,
            AIRDROP_ALLOCATION
        );

        _mint(
            treasuryReserve,
            TREASURY_ALLOCATION
        );
    }

    // --------------------------------------------------
    // EMISSION CONTROLLER
    // --------------------------------------------------

    function setEmissionController(
        address newController
    )
        external
        onlyOwner
    {
        require(
            newController != address(0),
            "Invalid controller"
        );

        address oldController =
            emissionController;

        emissionController =
            newController;

        emit EmissionControllerUpdated(
            oldController,
            newController
        );
    }

    // --------------------------------------------------
    // FUTURE EMISSION
    // --------------------------------------------------

    function mintFutureEmission(
        address to,
        uint256 amount
    )
        external
    {
        require(
            msg.sender == emissionController,
            "Only emission controller"
        );

        require(
            to != address(0),
            "Invalid recipient"
        );

        require(
            amount > 0,
            "Zero emission"
        );

        require(
            totalFutureMinted + amount <=
                FUTURE_EMISSION,
            "Future emission exceeded"
        );

        require(
            totalSupply() + amount <=
                MAX_SUPPLY,
            "Max supply exceeded"
        );

        totalFutureMinted += amount;

        _mint(to, amount);

        emit FutureEmissionMinted(
            to,
            amount
        );
    }

    // --------------------------------------------------
    // BURN
    // --------------------------------------------------

    function burn(
        uint256 amount
    )
        external
    {
        require(
            amount > 0,
            "Zero burn"
        );

        _burn(
            msg.sender,
            amount
        );
    }
}
