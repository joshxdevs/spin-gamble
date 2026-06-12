# 100xGamble

A Solana-based gambling platform where users can connect their Phantom wallet and play casino-style games using SOL on devnet.

## Games

### Coin Flip
Pick heads or tails, choose a bet amount (0.1, 0.5, 1, or 2 SOL), and flip. Win = 2x your bet sent back instantly.

### Roulette
Pick a number (0-36), place your bet, and spin the wheel. Hit your number = 10x payout.

## Tech Stack

**Frontend** (`wallet-adapter/`)
- React 19 + TypeScript + Vite
- Solana Wallet Adapter (Phantom)
- Tailwind CSS v4
- Framer Motion (roulette wheel animation)
- Jotai (state management)
- React Router

**Backend** (`backend/`)
- Express 5 + TypeScript
- Solana Web3.js
- Verifies on-chain transactions via RPC before determining outcomes

## How It Works

1. User connects their Phantom wallet
2. Selects a game and bet amount
3. Frontend sends SOL to the platform wallet via an on-chain transaction
4. Backend verifies the transaction signature against Solana devnet
5. Backend determines win/loss (50/50 for coin flip, 1/37 for roulette)
6. If the user wins, the backend sends the payout from the platform wallet back to the user

## Getting Started

### Prerequisites
- Node.js
- pnpm
- Phantom wallet (browser extension)
- Solana devnet SOL (get from [Solana Faucet](https://faucet.solana.com))

### Backend

```bash
cd backend
pnpm install
```

Create a `.env` file:

```
PLATFORM_PUBLIC_KEY=<your-platform-wallet-public-key>
PLATFORM_PRIVATE_KEY=<your-platform-wallet-private-key-base58>
```

```bash
pnpm dev
```

The server runs on `http://localhost:3000`.

### Frontend

```bash
cd wallet-adapter
pnpm install
pnpm dev
```

Opens on `http://localhost:5173`.

## Project Structure

```
.
├── backend/
│   └── src/
│       ├── index.ts          # Express server with /flip and /roulette endpoints
│       └── config/utils.ts   # Platform keypair and constants
├── wallet-adapter/
│   └── src/
│       ├── pages/
│       │   ├── landing.tsx    # Landing page with game selection
│       │   ├── coinFlip.tsx   # Coin flip game
│       │   └── roulette.tsx   # Roulette game
│       ├── components/
│       │   ├── nav.tsx        # Navbar with wallet connect + balance
│       │   └── rouletteWhele.tsx  # Animated roulette wheel
│       ├── config/utils.ts   # Frontend constants
│       └── store/atom.ts     # Jotai atoms
└── .gitignore
```

## Disclaimer

This project runs on Solana **devnet** and is built for learning/educational purposes. Not intended for real-money gambling.
