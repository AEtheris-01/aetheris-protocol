from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    PageBreak,
    Table,
    TableStyle,
    KeepTogether,
)

OUTPUT = "public/AETHERIS-V2-Whitepaper.pdf"


# ---------------------------------------------------------
# DOCUMENT
# ---------------------------------------------------------

doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=A4,
    rightMargin=18 * mm,
    leftMargin=18 * mm,
    topMargin=20 * mm,
    bottomMargin=18 * mm,
    title="AETHERIS Protocol — V2 Whitepaper",
    author="AETHERIS Protocol",
    subject="AETHERIS V2 Protocol Whitepaper",
)


# ---------------------------------------------------------
# COLORS
# ---------------------------------------------------------

DARK = colors.HexColor("#07101F")
CYAN = colors.HexColor("#06B6D4")
LIGHT_CYAN = colors.HexColor("#E6FAFF")
GRAY = colors.HexColor("#52606D")
LIGHT_GRAY = colors.HexColor("#F3F6F8")
WHITE = colors.white
BLACK = colors.HexColor("#111827")


# ---------------------------------------------------------
# STYLES
# ---------------------------------------------------------

styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    "WhitepaperTitle",
    parent=styles["Title"],
    fontName="Helvetica-Bold",
    fontSize=29,
    leading=35,
    alignment=TA_CENTER,
    textColor=DARK,
    spaceAfter=12,
)

subtitle_style = ParagraphStyle(
    "WhitepaperSubtitle",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=12,
    leading=18,
    alignment=TA_CENTER,
    textColor=GRAY,
    spaceAfter=10,
)

h1 = ParagraphStyle(
    "Heading1Aetheris",
    parent=styles["Heading1"],
    fontName="Helvetica-Bold",
    fontSize=20,
    leading=25,
    textColor=DARK,
    spaceBefore=8,
    spaceAfter=12,
)

h2 = ParagraphStyle(
    "Heading2Aetheris",
    parent=styles["Heading2"],
    fontName="Helvetica-Bold",
    fontSize=14,
    leading=19,
    textColor=DARK,
    spaceBefore=12,
    spaceAfter=7,
)

body = ParagraphStyle(
    "BodyAetheris",
    parent=styles["BodyText"],
    fontName="Helvetica",
    fontSize=9.5,
    leading=15,
    textColor=BLACK,
    spaceAfter=8,
)

small = ParagraphStyle(
    "SmallAetheris",
    parent=body,
    fontSize=8,
    leading=12,
    textColor=GRAY,
)

bullet = ParagraphStyle(
    "BulletAetheris",
    parent=body,
    leftIndent=12,
    firstLineIndent=-7,
    bulletIndent=0,
)

callout = ParagraphStyle(
    "CalloutAetheris",
    parent=body,
    fontName="Helvetica-Bold",
    fontSize=9,
    leading=14,
    textColor=DARK,
)


# ---------------------------------------------------------
# HELPERS
# ---------------------------------------------------------

def P(text, style=body):
    return Paragraph(text, style)


def H1(text):
    return Paragraph(text, h1)


def H2(text):
    return Paragraph(text, h2)


def bullet_item(text):
    return Paragraph("• " + text, bullet)


def callout_box(text):
    table = Table(
        [[Paragraph(text, callout)]],
        colWidths=[174 * mm],
    )

    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), LIGHT_CYAN),
                ("BOX", (0, 0), (-1, -1), 0.8, CYAN),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 9),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
            ]
        )
    )

    return table


def contract_table(rows):
    data = [
        [
            P("<b>Contract</b>", small),
            P("<b>Sepolia Address</b>", small),
        ]
    ]

    for name, address in rows:
        data.append(
            [
                P(name, small),
                P(address, small),
            ]
        )

    table = Table(
        data,
        colWidths=[55 * mm, 119 * mm],
        repeatRows=1,
    )

    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), DARK),
                ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
                ("BACKGROUND", (0, 1), (-1, -1), colors.white),
                ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#CBD5E1")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 7),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )

    return table


def footer(canvas, document):
    canvas.saveState()

    width, height = A4

    canvas.setStrokeColor(colors.HexColor("#D9E2E8"))
    canvas.line(
        18 * mm,
        12 * mm,
        width - 18 * mm,
        12 * mm,
    )

    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(GRAY)

    canvas.drawString(
        18 * mm,
        7 * mm,
        "AETHERIS Protocol · V2 Whitepaper · Ethereum Sepolia",
    )

    canvas.drawRightString(
        width - 18 * mm,
        7 * mm,
        f"Page {document.page}",
    )

    canvas.restoreState()


# ---------------------------------------------------------
# STORY
# ---------------------------------------------------------

story = []


# ---------------------------------------------------------
# COVER
# ---------------------------------------------------------

story.append(Spacer(1, 32 * mm))

story.append(
    Paragraph(
        "AETHERIS",
        ParagraphStyle(
            "Brand",
            parent=title_style,
            fontSize=18,
            leading=22,
            textColor=CYAN,
            spaceAfter=15,
        ),
    )
)

story.append(
    P(
        "A Collateralized Monetary Protocol",
        title_style,
    )
)

story.append(
    P(
        "AETHERIS Protocol — V2 Whitepaper",
        subtitle_style,
    )
)

story.append(
    P(
        "AUSD Stablecoin · Vaults · Oracle Infrastructure · "
        "Protocol Fees · Treasury · AETR · Staking",
        subtitle_style,
    )
)

story.append(Spacer(1, 18 * mm))

cover_box = Table(
    [
        [
            P(
                "<b>Current deployment</b><br/>"
                "Ethereum Sepolia Testnet"
            ),
            P(
                "<b>Protocol assets</b><br/>"
                "AUSD · AETR"
            ),
        ],
        [
            P(
                "<b>Architecture</b><br/>"
                "Collateralized Vault system"
            ),
            P(
                "<b>Version</b><br/>"
                "AETHERIS V2"
            ),
        ],
    ],
    colWidths=[87 * mm, 87 * mm],
)

cover_box.setStyle(
    TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, -1), LIGHT_GRAY),
            ("BOX", (0, 0), (-1, -1), 0.8, CYAN),
            ("INNERGRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#CBD5E1")),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 12),
            ("RIGHTPADDING", (0, 0), (-1, -1), 12),
            ("TOPPADDING", (0, 0), (-1, -1), 12),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
        ]
    )
)

story.append(cover_box)
story.append(Spacer(1, 15 * mm))

story.append(
    P(
        "This document describes the architecture and currently "
        "deployed functionality of AETHERIS V2. Where functionality "
        "is planned rather than deployed, it is explicitly identified "
        "as a future direction.",
        small,
    )
)

story.append(PageBreak())


# ---------------------------------------------------------
# TABLE OF CONTENTS
# ---------------------------------------------------------

story.append(H1("Contents"))

contents = [
    "1. Abstract",
    "2. Vision and Design Principles",
    "3. Protocol Architecture",
    "4. AUSD Stablecoin",
    "5. Vault and Collateral",
    "6. Borrowing and Repayment",
    "7. Liquidation Engine",
    "8. Price Oracle",
    "9. Protocol Fee Router",
    "10. Treasury and Cold-Wallet Architecture",
    "11. AETR Token",
    "12. AETR Tokenomics",
    "13. Staking",
    "14. Security Architecture",
    "15. Risk Management",
    "16. Ethereum Sepolia Testnet",
    "17. Smart Contract Addresses",
    "18. Roadmap",
    "19. Disclaimer",
]

for item in contents:
    story.append(bullet_item(item))

story.append(PageBreak())


# ---------------------------------------------------------
# 1 ABSTRACT
# ---------------------------------------------------------

story.append(H1("1. Abstract"))

story.append(
    P(
        "AETHERIS is a collateralized monetary protocol designed "
        "around the AUSD stablecoin, user Vaults, on-chain risk "
        "management, price-oracle infrastructure, protocol fee "
        "routing, Treasury reserves, AETR token economics and staking."
    )
)

story.append(
    P(
        "The protocol separates major responsibilities across "
        "dedicated smart contracts. The Vault manages collateralized "
        "debt positions, AUSD provides the monetary accounting layer, "
        "the PriceOracle provides market data, the ProtocolFeeRouter "
        "coordinates protocol fee accounting, Treasury provides "
        "reserve infrastructure, and AETR and Staking provide the "
        "protocol's token and staking layers."
    )
)

story.append(
    callout_box(
        "AETHERIS V2 is currently deployed and tested on Ethereum "
        "Sepolia. Testnet assets and balances should not be treated "
        "as production monetary reserves or financial guarantees."
    )
)

# ---------------------------------------------------------
# 2 VISION
# ---------------------------------------------------------

story.append(H1("2. Vision and Design Principles"))

story.append(
    P(
        "The AETHERIS design is centered on transparent on-chain "
        "accounting and separation of protocol responsibilities."
    )
)

story.append(bullet_item(
    "<b>Collateralization:</b> AUSD borrowing is associated with "
    "collateralized Vault positions."
))

story.append(bullet_item(
    "<b>On-chain accounting:</b> Core balances, debt, collateral, "
    "supply and protocol parameters are represented by smart contracts."
))

story.append(bullet_item(
    "<b>Risk controls:</b> Borrowing and liquidation behavior is "
    "governed by explicit contract parameters."
))

story.append(bullet_item(
    "<b>Oracle awareness:</b> Price data includes update information "
    "and freshness controls."
))

story.append(bullet_item(
    "<b>Reserve separation:</b> Treasury reserves are separated "
    "conceptually from active Vault collateral."
))

story.append(bullet_item(
    "<b>Operational security:</b> Administrative capabilities are "
    "restricted through contract-level authorization."
))


# ---------------------------------------------------------
# 3 ARCHITECTURE
# ---------------------------------------------------------

story.append(H1("3. Protocol Architecture"))

story.append(
    P(
        "AETHERIS V2 uses a modular contract architecture. Each "
        "major subsystem has a defined responsibility."
    )
)

architecture_rows = [
    ("Vault", "Collateral, debt, borrowing, repayment, withdrawals and liquidation."),
    ("AUSD", "Stablecoin supply, balances, minting and burning through access control."),
    ("PriceOracle", "ETH, BTC and AETR price data and freshness information."),
    ("ProtocolFeeRouter", "Protocol fee calculation and allocation accounting."),
    ("Treasury", "Protocol reserves, token balances and designated cold-wallet infrastructure."),
    ("AETRToken", "AETR supply, burn and controlled future-emission functionality."),
    ("Staking", "AETR staking balances, deposits and withdrawals."),
]

architecture_table = Table(
    [
        [P("<b>Component</b>", small), P("<b>Responsibility</b>", small)]
    ]
    + [
        [P(a, small), P(b, small)]
        for a, b in architecture_rows
    ],
    colWidths=[50 * mm, 124 * mm],
    repeatRows=1,
)

architecture_table.setStyle(
    TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, 0), DARK),
            ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
            ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#CBD5E1")),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 7),
            ("RIGHTPADDING", (0, 0), (-1, -1), 7),
            ("TOPPADDING", (0, 0), (-1, -1), 7),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ]
    )
)

story.append(architecture_table)


# ---------------------------------------------------------
# 4 AUSD
# ---------------------------------------------------------

story.append(H1("4. AUSD Stablecoin"))

story.append(
    P(
        "AUSD is the primary stablecoin asset of the AETHERIS "
        "monetary layer. The deployed AUSD contract uses role-based "
        "authorization for privileged monetary operations."
    )
)

story.append(H2("Core properties"))

story.append(bullet_item(
    "ERC-20 compatible token interface."
))

story.append(bullet_item(
    "18 decimal places in the deployed implementation."
))

story.append(bullet_item(
    "Role-controlled minting."
))

story.append(bullet_item(
    "Role-controlled burning."
))

story.append(bullet_item(
    "Administrative controls protected through access control."
))

story.append(H2("AUSD lifecycle"))

story.append(
    P(
        "A typical user lifecycle begins with collateral being deposited "
        "into the Vault. Subject to the Vault's risk parameters, the "
        "user can borrow AUSD. When the user repays AUSD debt, the "
        "outstanding Vault debt is reduced."
    )
)

story.append(
    callout_box(
        "The deployed smart contract remains the source of truth for "
        "AUSD supply, balances, roles and monetary execution."
    )
)


# ---------------------------------------------------------
# 5 VAULT
# ---------------------------------------------------------

story.append(H1("5. Vault and Collateral"))

story.append(
    P(
        "The Vault is the principal collateralized debt engine. "
        "The deployed V2 Vault tracks ETH collateral and AUSD debt "
        "on a per-user basis."
    )
)

story.append(H2("User position"))

story.append(bullet_item(
    "ETH collateral deposited by the user."
))

story.append(bullet_item(
    "AUSD debt associated with the user."
))

story.append(bullet_item(
    "Collateral valuation based on the configured PriceOracle."
))

story.append(bullet_item(
    "Maximum borrowing capacity determined by Vault parameters."
))

story.append(bullet_item(
    "Withdrawal functionality subject to the deployed contract's checks."
))

story.append(
    P(
        "The V2 Vault exposes parameters including maximum LTV, "
        "liquidation threshold, liquidation bonus, maximum liquidation "
        "close factor and borrowing fee."
    )
)


# ---------------------------------------------------------
# 6 BORROWING
# ---------------------------------------------------------

story.append(H1("6. Borrowing and Repayment"))

story.append(H2("Borrowing"))

story.append(
    P(
        "A user can request AUSD borrowing through the Vault. "
        "The Vault evaluates the user's position against its configured "
        "borrowing limits before executing the transaction."
    )
)

story.append(H2("Repayment"))

story.append(
    P(
        "A user can repay AUSD against the Vault debt. Successful "
        "repayment reduces the outstanding debt recorded for the "
        "user and can improve the health of the collateralized position."
    )
)

story.append(
    callout_box(
        "Borrowing capacity, debt accounting and transaction execution "
        "are enforced by the Vault contract rather than by the website UI."
    )
)


# ---------------------------------------------------------
# 7 LIQUIDATION
# ---------------------------------------------------------

story.append(H1("7. Liquidation Engine"))

story.append(
    P(
        "The liquidation engine protects the collateralized debt system "
        "when positions no longer satisfy the configured risk parameters."
    )
)

story.append(H2("Relevant V2 parameters"))

story.append(bullet_item(
    "LIQUIDATION_THRESHOLD_BPS"
))

story.append(bullet_item(
    "LIQUIDATION_BONUS_BPS"
))

story.append(bullet_item(
    "MAX_LIQUIDATION_CLOSE_FACTOR_BPS"
))

story.append(bullet_item(
    "MAX_LTV_BPS"
))

story.append(
    P(
        "The V2 Vault exposes an isHealthy function and a liquidate "
        "function. These mechanisms allow the deployed contract to "
        "determine position health and process eligible liquidations."
    )
)

story.append(
    callout_box(
        "Liquidation parameters are contract-controlled. The website "
        "is an interface and monitoring layer and does not replace "
        "the smart contract's enforcement."
    )
)


# ---------------------------------------------------------
# 8 ORACLE
# ---------------------------------------------------------

story.append(H1("8. Price Oracle"))

story.append(
    P(
        "The PriceOracle contract supplies market-price information "
        "used by the protocol. The deployed V2 implementation exposes "
        "ETH, BTC and AETR price data together with timestamp information."
    )
)

story.append(H2("Supported price feeds"))

story.append(bullet_item("ETH price"))
story.append(bullet_item("BTC price"))
story.append(bullet_item("AETR price"))

story.append(H2("Freshness"))

story.append(
    P(
        "The oracle exposes a configurable maximum price age and "
        "functions for evaluating whether price information remains fresh."
    )
)

story.append(
    callout_box(
        "Oracle freshness is a critical risk consideration because "
        "stale collateral prices can affect borrowing and liquidation decisions."
    )
)


# ---------------------------------------------------------
# 9 FEE ROUTER
# ---------------------------------------------------------

story.append(H1("9. Protocol Fee Router"))

story.append(
    P(
        "The ProtocolFeeRouter is the fee accounting and allocation "
        "layer of the deployed V2 architecture."
    )
)

story.append(H2("Exposed functionality"))

story.append(bullet_item(
    "Fee calculation from an AUSD amount."
))

story.append(bullet_item(
    "Total protocol fee basis points."
))

story.append(bullet_item(
    "AETR allocation basis points."
))

story.append(bullet_item(
    "BTC allocation basis points."
))

story.append(bullet_item(
    "Cumulative fee accounting."
))

story.append(bullet_item(
    "AETR allocation tracking."
))

story.append(bullet_item(
    "BTC allocation tracking."
))

story.append(
    P(
        "The fee router also exposes administrative controls for "
        "the fee collector and Treasury configuration."
    )
)


# ---------------------------------------------------------
# 10 TREASURY
# ---------------------------------------------------------

story.append(H1("10. Treasury and Cold-Wallet Architecture"))

story.append(
    P(
        "The Treasury is designed as a separate reserve layer rather "
        "than treating active Vault collateral and protocol reserves "
        "as the same operational pool."
    )
)

story.append(H2("Treasury functions"))

story.append(bullet_item(
    "ETH balance reporting."
))

story.append(bullet_item(
    "ERC-20 token balance reporting."
))

story.append(bullet_item(
    "Designated cold-wallet identification."
))

story.append(bullet_item(
    "Controlled ETH withdrawals."
))

story.append(bullet_item(
    "Controlled token withdrawals."
))

story.append(
    P(
        "The deployed Treasury contract identifies a coldWallet address "
        "and provides reserve accounting functions."
    )
)

story.append(
    callout_box(
        "Cold-wallet custody reduces online exposure but does not create "
        "an absolute guarantee against compromise, loss or operational error."
    )
)


# ---------------------------------------------------------
# 11 AETR
# ---------------------------------------------------------

story.append(H1("11. AETR Token"))

story.append(
    P(
        "AETR is the native protocol token of the AETHERIS ecosystem. "
        "The deployed V2 AETR contract exposes a maximum supply, "
        "allocation constants, controlled future-emission functionality "
        "and token burning."
    )
)

story.append(H2("Contract-level functionality"))

story.append(bullet_item(
    "MAX_SUPPLY"
))

story.append(bullet_item(
    "INITIAL_SUPPLY"
))

story.append(bullet_item(
    "Future emission accounting"
))

story.append(bullet_item(
    "Emission controller"
))

story.append(bullet_item(
    "Burn functionality"
))

story.append(
    P(
        "The public dashboard reads these values directly from the "
        "deployed contract so that tokenomics information can be "
        "compared with the on-chain source of truth."
    )
)


# ---------------------------------------------------------
# 12 TOKENOMICS
# ---------------------------------------------------------

story.append(H1("12. AETR Tokenomics"))

story.append(
    P(
        "The deployed AETR contract exposes allocation categories "
        "including Airdrop Allocation, Future Emission, Holder Reward "
        "Allocation, Treasury Allocation and Vault Incentive Allocation."
    )
)

tokenomics_rows = [
    ("Airdrop Allocation", "Contract-defined allocation"),
    ("Future Emission", "Contract-defined future emission allocation"),
    ("Holder Reward Allocation", "Contract-defined allocation"),
    ("Treasury Allocation", "Contract-defined allocation"),
    ("Vault Incentive Allocation", "Contract-defined allocation"),
]

story.append(
    Table(
        [
            [P("<b>Category</b>", small), P("<b>Status</b>", small)]
        ]
        + [
            [P(a, small), P(b, small)]
            for a, b in tokenomics_rows
        ],
        colWidths=[75 * mm, 99 * mm],
        repeatRows=1,
        style=TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), DARK),
                ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
                ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#CBD5E1")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 7),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        ),
    )
)

story.append(
    callout_box(
        "Live supply, allocation and emission values should be read "
        "from the deployed AETR contract and the AETHERIS dashboard. "
        "This document does not substitute for on-chain verification."
    )
)


# ---------------------------------------------------------
# 13 STAKING
# ---------------------------------------------------------

story.append(H1("13. Staking"))

story.append(
    P(
        "The deployed Staking contract provides a basic AETR staking "
        "layer. It records individual balances and total staked AETR."
    )
)

story.append(bullet_item(
    "stake(uint256 amount)"
))

story.append(bullet_item(
    "withdraw(uint256 amount)"
))

story.append(bullet_item(
    "balances(address)"
))

story.append(bullet_item(
    "totalStaked()"
))

story.append(
    P(
        "The website provides an interface for monitoring and interacting "
        "with the deployed staking functionality."
    )
)


# ---------------------------------------------------------
# 14 SECURITY
# ---------------------------------------------------------

story.append(H1("14. Security Architecture"))

story.append(
    P(
        "AETHERIS V2 uses multiple layers of controls. Security is "
        "treated as a system property rather than a single feature."
    )
)

security_points = [
    ("Access Control", "Privileged functions are restricted by contract-level authorization."),
    ("Oracle Freshness", "Price data includes timestamps and freshness controls."),
    ("Vault Risk Controls", "Borrowing and liquidation are governed by explicit parameters."),
    ("Pause Controls", "Relevant V2 contracts expose pause and unpause functionality."),
    ("Treasury Separation", "Reserve custody is separated from active user collateral."),
    ("Role-Based AUSD", "Minting and burning are protected by access-control roles."),
    ("Emission Control", "Future AETR emission is controlled through an emission-controller mechanism."),
]

for title, text in security_points:
    story.append(
        KeepTogether(
            [
                H2(title),
                P(text),
            ]
        )
    )

story.append(
    callout_box(
        "<b>Security disclaimer:</b> No smart-contract protocol can "
        "honestly guarantee that it is impossible to hack. AETHERIS "
        "security should be evaluated through code review, testing, "
        "auditing, monitoring, operational controls and responsible "
        "disclosure."
    )
)


# ---------------------------------------------------------
# 15 RISK
# ---------------------------------------------------------

story.append(H1("15. Risk Management"))

story.append(
    P(
        "A collateralized monetary system has several important risk "
        "categories. AETHERIS V2 addresses these through explicit "
        "contract parameters and operational separation."
    )
)

risk_rows = [
    ("Collateral Risk", "Collateral prices can change rapidly and affect Vault health."),
    ("Oracle Risk", "Incorrect or stale price data can affect protocol decisions."),
    ("Smart Contract Risk", "Code vulnerabilities can cause loss or incorrect execution."),
    ("Liquidation Risk", "Rapid market moves can create difficult liquidation conditions."),
    ("Liquidity Risk", "Market liquidity may affect the practical execution of asset transactions."),
    ("Operational Risk", "Administrative keys and custody procedures must be protected."),
    ("Governance / Configuration Risk", "Protocol parameters and privileged roles require careful management."),
]

for name, description in risk_rows:
    story.append(
        bullet_item(
            f"<b>{name}:</b> {description}"
        )
    )


# ---------------------------------------------------------
# 16 TESTNET
# ---------------------------------------------------------

story.append(H1("16. Ethereum Sepolia Testnet"))

story.append(
    P(
        "The current public AETHERIS V2 deployment is integrated with "
        "Ethereum Sepolia. The website allows users to connect a compatible "
        "wallet and interact with the deployed testnet contracts."
    )
)

story.append(H2("Recommended test workflow"))

story.append(bullet_item(
    "Connect MetaMask to Ethereum Sepolia."
))

story.append(bullet_item(
    "Obtain Sepolia test ETH."
))

story.append(bullet_item(
    "Open the AETHERIS Dashboard."
))

story.append(bullet_item(
    "Deposit test ETH into the Vault."
))

story.append(bullet_item(
    "Test AUSD borrowing."
))

story.append(bullet_item(
    "Test AUSD repayment."
))

story.append(bullet_item(
    "Test withdrawals where the position permits them."
))

story.append(bullet_item(
    "Review Oracle, Treasury, Tokenomics and AUSD dashboards."
))

story.append(
    callout_box(
        "Sepolia is a test environment. Testnet assets do not represent "
        "production assets or protocol reserves."
    )
)


# ---------------------------------------------------------
# 17 CONTRACT ADDRESSES
# ---------------------------------------------------------

story.append(H1("17. Smart Contract Addresses"))

contracts = [
    (
        "AETR Token",
        "0xA6E6B409d1C40df1508bD06dC3B6f03f3CfeE66f",
    ),
    (
        "AUSD Stablecoin",
        "0x614828e0b0db723e2B15196c6c6EcD230bf960A6",
    ),
    (
        "Price Oracle",
        "0xe8a3b616fa79C77908F304AB7C0b03976295c4f0",
    ),
    (
        "Treasury",
        "0xf8e361Ae009bEE83FB78bcD7B10Dbb4839413B40",
    ),
    (
        "Vault",
        "0xF7DaA3b8DBFc3E923ce9645BA803d5Cff86d38C6",
    ),
    (
        "Protocol Fee Router",
        "0x14830D7463C51c1EDf78f42bCC93D7017c306211",
    ),
    (
        "Staking",
        "0x07f1752864abcFA1AE67742dF61E3ADD368f22b8",
    ),
]

story.append(contract_table(contracts))

story.append(Spacer(1, 6))
story.append(
    P(
        "Network: Ethereum Sepolia",
        small,
    )
)


# ---------------------------------------------------------
# 18 ROADMAP
# ---------------------------------------------------------

story.append(H1("18. Roadmap"))

story.append(
    P(
        "The roadmap below distinguishes the current V2 foundation "
        "from future protocol development."
    )
)

roadmap = [
    (
        "Phase 1",
        "V2 Sepolia deployment, Vault, AUSD, AETR, Oracle, Treasury, "
        "Staking and Protocol Fee Router.",
    ),
    (
        "Phase 2",
        "Public testnet interface, documentation, tokenomics dashboard, "
        "risk monitoring and community testing.",
    ),
    (
        "Phase 3",
        "Security review, testing expansion, monitoring infrastructure "
        "and preparation for broader testnet participation.",
    ),
    (
        "Phase 4",
        "Future production-readiness work subject to audits, risk review, "
        "economic validation and governance decisions.",
    ),
]

for phase, description in roadmap:
    story.append(
        KeepTogether(
            [
                H2(phase),
                P(description),
            ]
        )
    )

story.append(
    callout_box(
        "Future functionality should not be interpreted as deployed "
        "functionality until it is implemented, tested and independently "
        "verified on-chain."
    )
)


# ---------------------------------------------------------
# 19 DISCLAIMER
# ---------------------------------------------------------

story.append(H1("19. Disclaimer"))

story.append(
    P(
        "This whitepaper is an informational and technical description "
        "of the AETHERIS V2 protocol architecture. It is not financial, "
        "legal, tax or investment advice."
    )
)

story.append(
    P(
        "AETHERIS V2 is currently presented through Ethereum Sepolia "
        "testnet infrastructure. Testnet tokens have no intended "
        "production value. Smart-contract interactions involve technical "
        "and economic risks, including smart-contract vulnerabilities, "
        "oracle failures, market volatility, liquidation risk, liquidity "
        "risk, key-management risk and operational failures."
    )
)

story.append(
    P(
        "No statement in this document should be interpreted as a "
        "guarantee that AUSD will always trade at exactly USD 1, that "
        "the protocol cannot lose funds, or that the protocol is "
        "impossible to compromise."
    )
)

story.append(
    P(
        "Users should independently verify contract addresses, source "
        "code, transaction details and network information before "
        "interacting with any AETHERIS deployment."
    )
)

story.append(Spacer(1, 10 * mm))

story.append(
    P(
        "<b>AETHERIS Protocol</b><br/>"
        "Ethereum Sepolia · AETHERIS V2<br/>"
        "https://github.com/AEtheris-01/aetheris-protocol<br/>"
        "https://x.com/Aetheris_pro",
        small,
    )
)


# ---------------------------------------------------------
# BUILD
# ---------------------------------------------------------

doc.build(
    story,
    onFirstPage=footer,
    onLaterPages=footer,
)

print(f"Whitepaper generated: {OUTPUT}")
