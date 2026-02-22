# ChainLens

**On-chain intelligence as a service** — real-time blockchain analytics as x402-paywalled microservices on Base, built on [PinionOS](https://github.com/chu2bard/pinion-os).

Each API call costs **$0.01 USDC**, settled instantly on Base L2. No API keys, no subscriptions — just pay per query.

> Built for the **PinionOS Hackathon** — demonstrating the "software that earns" paradigm.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                            ChainLens                                │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐                    ┌──────────────────────────┐
│                      │   HTTP + x402      │                          │
│   Next.js 14         │ ────────────────►  │   Skill Server           │
│   Dashboard          │                    │   (PinionOS Framework)   │
│                      │ ◄────────────────  │                          │
│  ┌────────────────┐  │   JSON response    │  ┌────────────────────┐  │
│  │ /  Catalog     │  │                    │  │ /portfolio/:addr   │  │
│  │ /explore       │  │                    │  │ /risk/:addr        │  │
│  │ /about         │  │                    │  │ /gas               │  │
│  └────────────────┘  │                    │  │ /token/:symbol     │  │
│                      │                    │  │ /tx/:hash          │  │
│  Port: 3000          │                    │  └────────────────────┘  │
└──────────────────────┘                    │                          │
                                            │  Port: 4020              │
         ┌──────────────────────┐           └────────────┬─────────────┘
         │                      │                        │
         │   Facilitator        │ ◄── Verify payment ────┘
         │   payai.network      │                        │
         │                      │             ┌──────────┴─────────────┐
         └──────────────────────┘             │                        │
                                              │   Base L2 RPC          │
                  USDC settlement             │   mainnet.base.org     │
                  on Base ──────────────►     │                        │
                                              │   ETH balances         │
                                              │   ERC-20 calls         │
                                              │   Gas prices           │
                                              │   Tx receipts          │
                                              └────────────────────────┘
```

## Available Skills

| Skill | Endpoint | Price | Description |
|-------|----------|-------|-------------|
| **Portfolio** | `GET /portfolio/:address` | $0.01 | Wallet analysis — ETH/USDC balances, transaction count, smart labels |
| **Risk** | `GET /risk/:address` | $0.02 | Risk scoring — activity analysis, contract detection, 0-100 score |
| **Gas** | `GET /gas` | $0.01 | Real-time gas tracker — slow/standard/fast prices with base fee |
| **Token** | `GET /token/:symbol` | $0.01 | Token info — decimals, total supply, USD price (ETH, USDC, USDT, DAI, WETH) |
| **Transaction** | `GET /tx/:hash` | $0.01 | Transaction decoder — from, to, value, gas used, status |

## Quick Start

### 1. Clone & Setup

```bash
git clone https://github.com/obseasd/ChainLens.git
cd ChainLens
cp .env.example .env
# Edit .env with your wallet address (to receive USDC payments)
```

### 2. Start the Skill Server

```bash
cd server
npm install
npm run dev
```

Server runs on **http://localhost:4020** — 5 skills registered, x402 middleware active.

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Dashboard runs on **http://localhost:3000** with skill catalog, interactive explorer, and x402 flow visualization.

### 4. Test the Skills

```bash
# Catalog (free — lists all available skills)
curl http://localhost:4020/catalog

# Gas tracker
curl http://localhost:4020/gas

# Wallet portfolio (Vitalik on Base)
curl http://localhost:4020/portfolio/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045

# Risk score
curl http://localhost:4020/risk/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045

# Token info
curl http://localhost:4020/token/USDC

# Transaction decode
curl http://localhost:4020/tx/0x<HASH>
```

## Screenshots

<!-- Add screenshots after deploying -->

| Home — Skill Catalog | Explorer — Interactive Caller | About — Architecture |
|:---:|:---:|:---:|
| *Skill catalog grid with prices* | *x402 payment flow visualization* | *Protocol explanation + diagram* |

## x402 Payment Flow

```
1. Client  →  GET /skill            →  Server
2. Server  →  402 Payment Required  →  Client    (price, asset, payTo, network)
3. Client  →  Sign EIP-3009 USDC authorization   (off-chain, no gas)
4. Client  →  GET /skill + X-PAYMENT header  →  Server
5. Server  →  Facilitator verifies & settles USDC on Base
6. Server  →  200 OK + JSON data    →  Client
```

> In local dev without `x402-express` installed, skills run in **free mode** (no payment required).

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Skill Server | TypeScript + Express + PinionOS server framework |
| Frontend | Next.js 14 + TypeScript + TailwindCSS |
| Payments | x402 protocol (EIP-3009 USDC authorization) |
| Network | Base L2 (Chain ID 8453) |
| Settlement | USDC on Base |
| RPC | https://mainnet.base.org |
| Facilitator | https://facilitator.payai.network |
| SDK | [`pinion-os`](https://github.com/chu2bard/pinion-os) |

## Project Structure

```
chainlens/
├── server/                     # Skill server (PinionOS)
│   ├── src/
│   │   ├── index.ts            # Server entry — registers 5 skills
│   │   ├── skills/
│   │   │   ├── portfolio.ts    # Wallet portfolio analysis
│   │   │   ├── risk.ts         # Wallet risk scoring
│   │   │   ├── gas.ts          # Real-time gas tracker
│   │   │   ├── token.ts        # Token info + price
│   │   │   └── tx.ts           # Transaction decoder
│   │   └── utils/
│   │       └── rpc.ts          # Base JSON-RPC helper
│   ├── package.json
│   └── tsconfig.json
├── frontend/                   # Next.js dashboard
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx        # Home — skill catalog
│   │   │   ├── explore/
│   │   │   │   └── page.tsx    # Explorer — interactive skill caller
│   │   │   └── about/
│   │   │       └── page.tsx    # About — how it works
│   │   ├── components/
│   │   │   ├── Header.tsx      # Nav + server status
│   │   │   ├── SkillCard.tsx   # Skill display card
│   │   │   ├── SkillCaller.tsx # Interactive API caller
│   │   │   └── JsonViewer.tsx  # Syntax-highlighted JSON + copy
│   │   └── lib/
│   │       └── pinion.ts       # API helper + skill metadata
│   ├── package.json
│   └── tailwind.config.ts
├── .env.example
├── .gitignore
└── README.md
```

## Built With

- [PinionOS](https://github.com/chu2bard/pinion-os) — Server framework + SDK for x402-paywalled services
- [x402](https://www.x402.org/) — Machine-to-machine payment protocol (HTTP 402)
- [Base](https://base.org/) — Ethereum L2 for fast, cheap USDC settlement

## License

MIT
