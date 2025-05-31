# Proof Bazaar

A Verified P2P Marketplace for Real-World Goods using World ID + Escrow + NFTs

## 🔗 Overview

Proof Bazaar enables users to buy and sell second-hand goods using NFTs and escrowed USDC payments. Only verified human users (via World ID) can list or purchase. All items are represented as NFTs, and transactions go through an escrow flow for buyer/seller trust.

## ✨ Features

- ✅ World ID Verification for Human Identity
- ✅ List physical items as ERC-721 NFTs
- ✅ Pay in USDC, held in on-chain escrow
- ✅ Release funds/NFTs only after buyer confirms
- ✅ Bidding system with refundable outbid flow
- ✅ Fully non-custodial listings

## 🛠️ Tech Stack

| Layer | Tech / Library |
|-------|----------------|
| Blockchain | Solidity, Hardhat, Flow EVM (or local) |
| Escrow Logic | Built-in within single Marketplace.sol |
| Verification | World ID |
| UI (optional) | Scaffold-ETH v2, RainbowKit, Ethers.js |
| Tokens | USDC (ERC-20) |

## ⚙️ Contract Architecture

### Marketplace.sol
Main smart contract containing:
- Listings
- Bidding
- Escrow for sales
- Receipt confirmation

## 📦 Installation

```bash
git clone https://github.com/your-handle/proof-bazaar.git
cd proof-bazaar
npm install
```

##  Testnet Setup

1. Add Flow EVM Testnet (or use local chain for dev)
```json
Chain ID: 1134
RPC: https://evm.testnet.flowchain.xyz
Currency: tFLOW
Explorer: https://evm-testnet.flowscan.io
```

2. Fund your wallet
Use Flow Testnet Faucet

## 📜 Contract Deployment

### Compile
```bash
npx hardhat compile
```

### Deploy
```bash
npx hardhat run scripts/deploy.js --network flowEVM
```

### Verify
```bash
npx hardhat verify --network flowEVM <contract_address>
```

## 🧾 How It Works (User Flow)

### 1. Seller lists an item
- Mints NFT with metadata (name, description, image)
- Price set in USDC
- NFT is transferred to contract for escrow listing

### 2. Buyer purchases item
- Buyer pays exact price in USDC
- Both USDC + NFT are held in escrow (inside contract)

### 3. Buyer confirms receipt
- Buyer calls confirmReceipt(tokenId)
- NFT is transferred to buyer
- USDC is transferred to seller

### 4. Bidding (optional)
- Buyer can place a bid on an active listing
- If outbid, previous bidder gets refunded
- Seller can accept any active bid

##  Key Functions

```solidity
function listItem(...)
function buyItem(uint tokenId)
function confirmReceipt(uint tokenId)
function placeBid(uint tokenId, uint amount)
function acceptBid(uint tokenId, uint bidIndex)
function cancelBid(uint tokenId, uint bidIndex)
function cancelListing(uint tokenId)
```

## Security Features

- Reentrancy protection (ReentrancyGuard)
- Only buyer can confirm escrow
- Timed listing expiry
- Refunds for outbid users
- Bid cancellation and listing cancellation support

## Ideas for Future Work

- Add dispute resolution window
- Integrate IPFS or Filecoin for metadata
- Escrow auto-release on timeout (optional)
- Frontend via Scaffold-ETH v2 + World App MiniKit


Built by Sukant Ghosh

Submitted to Eth Prague 2025 for Flow, Worldcoin, and Blockscout


