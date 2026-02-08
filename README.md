# WhisperFi

**Privacy-Preserving AI DeFi Intent Engine**

> Transform complex DeFi operations into simple conversations while automatically protecting your trades from MEV, front-running, and sandwich attacks.

**Live Demo:** [whisperfi.vercel.app](https://whisperfi.vercel.app) | **Pitch Deck:** [whisperfi.vercel.app/pitch](https://whisperfi.vercel.app/pitch)

---

## What is WhisperFi?

WhisperFi is a chat-based DeFi interface that uses Claude AI to parse natural language intents, analyze privacy risks, and generate optimized execution strategies. Instead of manually splitting trades, timing transactions, or routing through multiple chains — you just tell WhisperFi what you want, and the AI handles the rest.

**Example:**
```
User: "Swap 5 ETH for USDC on Base with maximum privacy"

WhisperFi:
  → Parsed intent: Swap 5 ETH → USDC on Base
  → Privacy score: 34/100 (high MEV risk for this size)
  → Recommended: Split into 3 orders + time delays + cross-chain obfuscation
  → Execution plan: 7 steps, ~4 min, ~$2.10 gas
```

## Architecture

```
┌─────────────────────────────────────────────────┐
│              Natural Language Input              │
└──────────────────────┬──────────────────────────┘
                       │
         ┌─────────────▼──────────────┐
         │   Claude AI Pipeline       │
         │  1. Intent Parser          │
         │  2. Privacy Analyzer       │
         │  3. Strategy Optimizer     │
         └─────────────┬──────────────┘
                       │
    ┌──────────────────▼──────────────────┐
    │        Execution Engine             │
    │  Uniswap v4 │ LI.FI │ ENS Records  │
    │  Splitting  │ Delays │ Obfuscation  │
    └─────────────────────────────────────┘
```

## Key Features

### AI-Powered Privacy
- **Intent Parsing** — Claude AI extracts trade parameters from natural language with structured tool use
- **Risk Analysis** — scores MEV exposure, front-running, sandwich attacks, timing correlation (0–100)
- **Strategy Optimization** — selects from 4 privacy tiers based on trade size, urgency, and risk

### Privacy Strategies
| Strategy | Privacy Score | Use Case |
|----------|-------------|----------|
| Standard | 40–50 | Small trades, low risk |
| Split Orders | 60–70 | Medium trades, hides true size |
| Time-Delayed | 70–80 | Adds random delays between splits |
| Cross-Chain Obfuscated | 85–95 | Large trades, routes through intermediate chains |

### Protocol Integrations
- **Uniswap v4** — swap execution via Universal Router with pool key encoding
- **LI.FI SDK** — real-time cross-chain quotes, bridge transactions, multi-chain routing
- **ENS** — decentralized strategy marketplace using text records (`com.whisperfi.strategy.*`)

### Execution Engine
- Multi-step state machine with real wallet signing (wagmi)
- Live countdown for time delays between split orders
- Chain switching, token approvals, error handling, and cancellation
- Step-by-step progress tracking with status badges

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Animation | Framer Motion |
| AI | Claude Sonnet 4 (Anthropic SDK) |
| Web3 | wagmi v2 + viem + RainbowKit |
| DEX | Uniswap v4 (Universal Router) |
| Bridges | LI.FI SDK |
| Identity | ENS (text records) |
| State | Zustand |

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your keys:
#   ANTHROPIC_API_KEY=sk-ant-...
#   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=...
#   NEXT_PUBLIC_ALCHEMY_API_KEY=...

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Main chat interface — type intents, execute trades |
| `/dashboard` | Wallet status, privacy scores, ENS strategy browser |
| `/pitch` | Interactive pitch deck (arrow keys to navigate) |

## Chains Supported

- **Base** (primary — low gas)
- **Arbitrum**
- **Ethereum Mainnet**

## Prize Track Alignment

| Track | Integration |
|-------|------------|
| **Uniswap — Agentic Finance** | AI agent builds and executes v4 swap transactions |
| **Uniswap — Privacy DeFi** | Order splitting, time delays, privacy scoring via v4 |
| **LI.FI — AI x Smart App** | AI-generated cross-chain routes with real LI.FI quotes |
| **ENS — Creative DeFi** | Strategy marketplace stored in ENS text records |

## Project Structure

```
src/
├── app/
│   ├── api/intent/       # AI processing API route
│   ├── dashboard/        # Dashboard page
│   └── pitch/            # Pitch deck
├── components/
│   └── chat/             # Chat interface
├── hooks/
│   └── useExecutionEngine.ts  # Multi-step execution state machine
├── lib/
│   ├── ai/               # Intent parser, privacy analyzer, strategy optimizer
│   ├── ens/              # ENS text record read/write
│   ├── lifi/             # Cross-chain quotes and bridge execution
│   └── uniswap/          # Swap building, privacy strategies
└── types/                # TypeScript types for intents, privacy, execution
```

---

Built for **EthGlobal HackMoney 2026**
