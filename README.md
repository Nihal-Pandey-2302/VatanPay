# VatanPay - Blockchain Remittance Platform

<div align="center">

**Send money home instantly with 0.5% fees using MoneyGram + Stellar**

[![Stellar](https://img.shields.io/badge/Stellar-Testnet-blue)](https://stellar.org)
[![MoneyGram](https://img.shields.io/badge/MoneyGram-Integration-red)](https://moneygram.com)
[![USDC](https://img.shields.io/badge/USDC-Stablecoin-green)](https://circle.com)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://react.dev)

[Live Demo](https://vatan-pay.vercel.app/) | [Documentation](./docs/HOW_IT_WORKS.md) | [Business Model](./docs/BUSINESS_MODEL.md)

</div>

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/Nihal-Pandey-2302/VatanPay
cd VatanPay

# Start development server (automatically installs dependencies)
./start.sh
```

**Or manually:**

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` and connect your Freighter wallet!

---

## 💡 What is VatanPay?

VatanPay enables Indian migrant workers in the Gulf to send money home instantly with **10x lower fees** than traditional remittance services.

### The Problem

- Western Union charges **5-7% fees**
- Bank transfers take **1-3 days**
- Hidden exchange rate markups
- Limited to banking hours

### Our Solution

- ⚡ **5-second settlement** via Stellar + USDC
- 💰 **0.5% platform fee** (10x cheaper)
- 🌍 **MoneyGram Integration** for cash on/off-ramps
- 🔒 **Trustless** via Circle's USDC stablecoin
- 🎁 **Simulated Demo** showing the cash-to-USDC flow

> **Note:** This is a testnet simulation of MoneyGram's integration. In production, users deposit cash at MoneyGram locations to receive USDC. This demo uses test tokens to simulate that flow. See [Production Roadmap](#-production-roadmap) for details.

---

## 📸 Screenshots

<div align="center">
  <img src="screenshots/BankDeposit.png" alt="Bank Deposit Page" width="800"/>
  <p><em>Bank Deposit (Faucet) - Simulating MoneyGram Integration</em></p>
  <br/>
  
  <img src="screenshots/Tx history.png" alt="Transaction History" width="800"/>
  <p><em>Transaction History - Verifiable On-Chain Proofs</em></p>
  <br/>

  <img src="screenshots/Docs.png" alt="Documentation" width="800"/>
  <p><em>Comprehensive Documentation & Guides</em></p>
</div>

---

## ✨ Features

### 🎨 Complete User Interface (6 Pages)

1. **Landing Page** - Learn about VatanPay's value proposition
2. **Send Money** - Execute remittances with real-time exchange rates
3. **Bank Deposit (Faucet)** ⭐ NEW - Simulate depositing AED cash to get USDC
4. **Token Swap** - Convert miscellaneous tokens to XLM (off-ramp)
5. **History** - View transaction history
6. **Documentation** - Complete guide to token economics and anchors

### 🔐 Smart Contract (Soroban)

- ✅ Escrow system (locks AED during transaction)
- ✅ 0.5% platform fee calculation
- ✅ Rate limiting (5 tx/day per user)
- ✅ 24-hour refund mechanism
- ✅ Transaction history tracking
- ✅ Event logging for transparency

### 💻 Frontend (React + TypeScript)

- ✅ Freighter wallet integration (with correct API!)
- ✅ Real-time exchange rates from Stellar DEX
- ✅ 3-step transaction flow with progress tracking
- ✅ **Self-service token management** (faucet + swap)
- ✅ Premium UI with Chakra UI custom theme
- ✅ Mobile-responsive design
- ✅ Comprehensive error handling

---

## 🏗️ Architecture

### System Flow

```mermaid
graph TB
    subgraph "UAE Side"
        Worker[Worker's Wallet]
    end

    subgraph "VatanPay Platform"
        Faucet[Token Faucet]
        SendPage[Send Money]
        Swap[Token Swap]
    end

    subgraph "Stellar Blockchain"
        SC[Smart Contract<br/>Escrow]
        DEX[Stellar DEX<br/>Path Payments]
    end

    subgraph "India Side"
        Recipient[Family's Wallet]
    end

    Worker -->|1. Deposit Cash| MoneyGram[MoneyGram Agent]
    MoneyGram -->|2. Issue USDC| Worker
    Worker -->|3. Send USDC| SendPage
    SendPage -->|4. Escrow| SC
    SC -->|5. Path Payment| DEX
    DEX -->|6. Convert USDC→XLM→INR| Recipient
    Recipient -->|7. Cash Out| Swap
```

### Transaction Flow (3 Steps)

```mermaid
sequenceDiagram
    actor User as Worker in UAE
    participant Frontend
    participant Contract as Smart Contract
    participant DEX as Stellar DEX
    participant Family as Family in India

    User->Frontend: Enter amount (USDC) & recipient
    Frontend->DEX: Query exchange rate
    DEX-->Frontend: 1 USDC = 200.5 INR

    Note over Frontend,Contract: STEP 1 - ESCROW
    Frontend->Contract: create_remittance(10 USDC)
    Contract->Contract: Lock USDC in escrow
    Contract-->Frontend: Remittance ID

    Note over Frontend,Family: STEP 2 - PATH PAYMENT
    Frontend->DEX: Execute USDC→XLM→INR
    DEX->Family: Transfer ~2,000 INR
    DEX-->Frontend: Transaction hash

    Note over Frontend,Contract: STEP 3 - COMPLETE
    Frontend->Contract: complete_remittance()
    Contract->Contract: Mark complete
    Contract-->Frontend: Success!
```

**See detailed architecture in [HOW_IT_WORKS.md](./docs/HOW_IT_WORKS.md)**

---

## 📊 Comparison

| Feature          | VatanPay  | Western Union | Bank Transfer  |
| ---------------- | --------- | ------------- | -------------- |
| **Fee**          | 0.5%      | 5-7%          | 3-4%           |
| **Speed**        | 5 seconds | 1-3 days      | 1-3 days       |
| **Availability** | 24/7      | Limited hours | Business hours |
| **Transparency** | On-chain  | Opaque        | Opaque         |
| **Min Amount**   | 100 AED   | Varies        | High           |

> **Note:** VatanPay metrics are for blockchain transactions on testnet. Production would require licensed anchor integration for fiat on/off-ramp, adding 1-2 hours for bank settlement via UPI/NEFT.

**Savings Example:**

- Send 10,000 AED
- VatanPay fee: **50 AED**
- Western Union fee: **500-700 AED**
- **You save: 450-650 AED every month!**

---

## 🎯 Demo Walkthrough

### Complete User Journey

**1. Bank Deposit (Simulated)** 🏦

```
→ Visit /faucet
→ Select "Deposit AED Cash"
→ System simulates MoneyGram deposit
→ You receive **USDC** in your wallet
```

**2. Send Money** 💸

```
→ Visit /send
→ Enter amount (e.g., 10 USDC)
→ See real-time rate (1 USDC = ~200 INR)
→ Enter recipient address
→ Review summary (Recipient gets: ~2,000 INR)
→ Approve in Freighter
→ Transaction completes in 5 seconds!
```

**3. Cash Out** 💱

```
→ Visit /swap
→ Select token (INR)
→ Swap to "Cash" (Simulated via XLM off-ramp)
→ Funds ready for pickup!
```

**4. Learn More** 📚

```
→ Visit /docs
→ Understand token economics
→ See how anchors work
→ Read business model analysis
```

---

## 🛠️ Tech Stack

| Layer               | Technology            |
| ------------------- | --------------------- |
| **Smart Contracts** | Soroban (Rust)        |
| **Blockchain**      | Stellar Network       |
| **Frontend**        | React 18 + TypeScript |
| **UI Framework**    | Chakra UI (Custom)    |
| **Wallet**          | Freighter API         |
| **Build Tool**      | Vite                  |
| **Routing**         | React Router v7       |

---

## 📁 Project Structure

```
VatanPay/
├── contract/                 # Soroban smart contract
│   ├── src/
│   │   ├── lib.rs           # Main contract logic
│   │   └── test.rs          # Test suite (291 lines)
│   ├── Cargo.toml
│   ├── README.md
│   └── SECURITY_ROADMAP.md
│
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Navbar, WalletConnect
│   │   ├── pages/           # 6 pages (Landing, Send, Faucet, Swap, History, Docs)
│   │   ├── services/        # wallet.ts, stellar.ts, contract.ts
│   │   ├── hooks/           # useWallet.tsx
│   │   ├── types/           # TypeScript interfaces
│   │   └── theme.ts         # Custom Chakra theme
│   └── package.json
│
├── docs/                     # Comprehensive documentation
│   ├── HOW_IT_WORKS.md      # Architecture + diagrams
│   └── BUSINESS_MODEL.md    # Economics analysis
│
├── scripts/                  # Deployment automation
│   ├── deploy-contract.sh
│   └── setup-testnet.sh
│
├── testnet-config.json
└── start.sh                  # One-command startup
```

---

## 🌐 Testnet Deployment

**Live Contracts & Assets**

| Component          | Address / ID                                                        | Explorer                                                                                                                            |
| :----------------- | :------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------- |
| **Smart Contract** | `CCB7BFIGSC6PRVVYHKZCEBFL4C7KTD4JU7NTLLMOUPEYHPGCQCH6GZU4`          | [View on Stellar.Expert](https://stellar.expert/explorer/testnet/contract/CCB7BFIGSC6PRVVYHKZCEBFL4C7KTD4JU7NTLLMOUPEYHPGCQCH6GZU4) |
| **USDC Asset**     | `USDC` : `GCGH7MHBMNIRWEU6XKZ4CUGESGWZHQJL36ZI2ZOSZAQV6PREJDNYKEYZ` | [View Asset](https://stellar.expert/explorer/testnet/asset/USDC-GCGH7MHBMNIRWEU6XKZ4CUGESGWZHQJL36ZI2ZOSZAQV6PREJDNYKEYZ)           |
| **Network**        | Stellar Testnet                                                     | `https://horizon-testnet.stellar.org`                                                                                               |

---

## 🚦 How to Use

### 1. Install Freighter Wallet

Download from [freighter.app](https://freighter.app) and set to **Testnet mode**.

### 2. Bank Deposit (On-Ramp)

In the real world, you would walk into a MoneyGram agent. In this demo:

- Connect your wallet
- Visit the **Bank Deposit** (Faucet) page
- Click "**Deposit AED Cash**"
- The system simulates a cash deposit and sends **USDC** to your wallet

### 3. Send Money

1. Visit **Send Money** page
2. Enter amount in **USDC** (e.g., 10 USDC)
3. Add recipient's Stellar address
4. The system calculates the conversion to **INR**
5. Confirm transaction
6. Recipient receives **INR** instantly!

### 4. Cash Out (Simulated)

- Visit **Swap** page
- Convert remaining AED/INR to XLM
- In production, this would withdraw to your bank account

---

## 💰 Business Model

VatanPay is **highly profitable** even at 0.5% fees:

**Revenue Streams:**

- Platform fee (0.5%)
- Float interest on reserves
- FX spread (0.09%)
- Premium services

**Unit Economics:**

- Revenue per tx: ~6 AED
- Cost per tx: ~1 AED (variable costs only)
- **Gross margin: 85%** (before marketing, CAC, and overhead)

**Why it works:**

- Blockchain is 10-15x more cost-efficient than correspondent banking
- No physical branches needed
- Automated smart contracts reduce labor costs
- Real-time DEX rates eliminate FX spread markup

**See full analysis in [BUSINESS_MODEL.md](./docs/BUSINESS_MODEL.md)**

---

## 📚 Documentation

### User Guides

- [HOW_IT_WORKS.md](./docs/HOW_IT_WORKS.md) - Complete system explanation with architecture diagrams
- [BUSINESS_MODEL.md](./docs/BUSINESS_MODEL.md) - Economics, revenue model, sustainability

### Technical Docs

- [contract/README.md](./contract/README.md) - Smart contract documentation
- [contract/SECURITY_ROADMAP.md](./contract/SECURITY_ROADMAP.md) - Security considerations
- [frontend/README.md](./frontend/README.md) - Frontend setup guide

---

## 🔐 Security

### Current (MVP)

- ✅ Escrow prevents fund theft
- ✅ Rate limiting prevents spam
- ✅ Amount validation (100-50k AED)
- ✅ Time-locked refunds (24 hours)
- ✅ Event logging for transparency
- ✅ Non-custodial (user controls keys)

### Roadmap (Production)

- [ ] Oracle integration for rate validation
- [ ] Multi-sig admin functions
- [ ] Professional security audit
- [ ] Enhanced authorization
- [ ] KYC/AML compliance

---

## 🎬 Development

### Build & Test

```bash
# Build smart contract
cd contract
cargo build --target wasm32-unknown-unknown --release

# Run tests
cargo test

# Start frontend
cd frontend
npm run dev

# Deploy to testnet
./scripts/deploy-contract.sh
```

---

## 🌟 Key Achievements

1. **Self-Contained Demo** - Built-in faucet and swap (no external dependencies)
2. **Real Blockchain Integration** - Actual Stellar path payments (not mocked)
3. **Production-Grade Code** - TypeScript, error handling, comprehensive docs
4. **Viable Business Model** - 85% margins documented with real-world examples
5. **Premium UX** - 6 polished pages with custom Chakra theme
6. **Educational** - Extensive documentation teaching blockchain finance

---

## 🚀 What Makes This Special

### Technical Innovation

- ✅ Stellar's path payments for automatic multi-currency conversion
- ✅ Smart contract escrow for trustless transactions
- ✅ Anchor model simulation (faucet = on-ramp, swap = off-ramp)
- ✅ Real-time DEX integration

### User Experience

- ✅ **Self-service token management** (no manual setup)
- ✅ 6 complete pages covering full journey
- ✅ Educational content integrated
- ✅ Premium fintech design

### Business Viability

- ✅ **85% gross margins** on transaction fees (before overhead)
- ✅ Cost structure 10-15x more efficient than correspondent banking
- ✅ Clear path to production (banking, compliance)
- ✅ Business model inspired by Wise (1-2% fees) and Remitly, powered by blockchain for lower costs

---

## 📜 License

MIT License - see [LICENSE](LICENSE) for details

---

## 🤝 Production Roadmap

To launch VatanPay in production:

### Legal & Banking

- [ ] Partner with UAE and India banks
- [ ] Register as MSB (Money Services Business)
- [ ] Obtain regulatory approvals
- [ ] Implement KYC/AML

### Technical

- [ ] Professional smart contract audit
- [ ] Mainnet deployment
- [ ] Banking API integration
- [ ] Anchor services (real on/off-ramp)

### Operations

- [ ] 24/7 customer support
- [ ] Fraud detection systems
- [ ] Liquidity management
- [ ] Marketing to diaspora communities

---

<div align="center">

**⭐ Star this repo if you find it useful!**

**Powered by Stellar & Soroban** | **Addressing the $36B Gulf-India remittance corridor**

</div>
