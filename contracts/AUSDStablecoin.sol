// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/extensions/AccessControlDefaultAdminRules.sol";

contract AUSDStablecoin is
    ERC20,
    AccessControlDefaultAdminRules
{
    // --------------------------------------------------
    // ROLES
    // --------------------------------------------------

    bytes32 public constant MINTER_ROLE =
        keccak256("MINTER_ROLE");

    bytes32 public constant BURNER_ROLE =
        keccak256("BURNER_ROLE");

    // --------------------------------------------------
    // CONSTRUCTOR
    // --------------------------------------------------

    constructor(
        address initialAdmin,
        uint48 adminDelay
    )
        ERC20("AETHERIS USD", "AUSD")
        AccessControlDefaultAdminRules(
            adminDelay,
            initialAdmin
        )
    {
        require(
            initialAdmin != address(0),
            "Invalid admin"
        );
    }

    // --------------------------------------------------
    // MINT
    // --------------------------------------------------

    function mint(
        address to,
        uint256 amount
    )
        external
        onlyRole(MINTER_ROLE)
    {
        require(
            to != address(0),
            "Invalid recipient"
        );

        require(
            amount > 0,
            "Zero mint"
        );

        _mint(to, amount);
    }

    // --------------------------------------------------
    // BURN
    // --------------------------------------------------

    function burn(
        address from,
        uint256 amount
    )
        external
        onlyRole(BURNER_ROLE)
    {
        require(
            from != address(0),
            "Invalid account"
        );

        require(
            amount > 0,
            "Zero burn"
        );

        _burn(from, amount);
    }
}
