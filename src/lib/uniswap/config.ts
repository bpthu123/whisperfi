// Uniswap v4 deployed contract addresses
// Reference: https://docs.uniswap.org/contracts/v4/deployments

export const UNISWAP_V4_ADDRESSES = {
  // Base (chainId: 8453)
  8453: {
    PoolManager: '0x498581fF718922c3f8e6A244956aF099B2652b2b' as `0x${string}`,
    UniversalRouter: '0x6fF5693b99212Da76ad316178A184AB56D299b43' as `0x${string}`,
    Permit2: '0x000000000022D473030F116dDEE9F6B43aC78BA3' as `0x${string}`,
    PositionManager: '0x7C5f5A4bBd8fD63184577525326123B519429bDc' as `0x${string}`,
    Quoter: '0x0d5e0F971ED27C7d00ac8c4DC17a63c1620a7735' as `0x${string}`,
  },
  // Arbitrum (chainId: 42161)
  42161: {
    PoolManager: '0x360E68faCcca8cA495c1B759Fd9EEe466db9FB32' as `0x${string}`,
    UniversalRouter: '0xa51afAF359d044F8e56fE74B9575f23142cD4B76' as `0x${string}`,
    Permit2: '0x000000000022D473030F116dDEE9F6B43aC78BA3' as `0x${string}`,
    PositionManager: '0xd88F38F930b7952f2DB2432Cb002E7abbF3dD869' as `0x${string}`,
    Quoter: '0x3972c00F7ed4885e145823f4b627AEBFF4790B53' as `0x${string}`,
  },
  // Ethereum Mainnet (chainId: 1)
  1: {
    PoolManager: '0x000000000004444c5dc75cB358380D2e3dE08A90' as `0x${string}`,
    UniversalRouter: '0x66a9893cC07D91D95644AEDD05D03f95e1dBA8Af' as `0x${string}`,
    Permit2: '0x000000000022D473030F116dDEE9F6B43aC78BA3' as `0x${string}`,
    PositionManager: '0xbD216513d74C8cf14cf4747E6AaA6420FF64ee9e' as `0x${string}`,
    Quoter: '0x52f0E24D1c21C8A0cB1e5a5dD6198556BD9E1203' as `0x${string}`,
  },
} as const;

// Universal Router command types for v4
export const V4_COMMANDS = {
  // Outer-level Universal Router command
  V4_SWAP: 0x10,
} as const;

// Inner v4 action types (used inside V4_SWAP input)
export const V4_ACTIONS = {
  SWAP_EXACT_IN_SINGLE: 0x06,
  SWAP_EXACT_IN: 0x07,
  SWAP_EXACT_OUT_SINGLE: 0x08,
  SWAP_EXACT_OUT: 0x09,
  SETTLE_ALL: 0x0c,
  TAKE_ALL: 0x0f,
} as const;

// Fee tiers available on Uniswap v4
export const FEE_TIERS = {
  LOWEST: 100,    // 0.01%
  LOW: 500,       // 0.05%
  MEDIUM: 3000,   // 0.30%
  HIGH: 10000,    // 1.00%
} as const;

export const TICK_SPACINGS: Record<number, number> = {
  100: 1,
  500: 10,
  3000: 60,
  10000: 200,
};
