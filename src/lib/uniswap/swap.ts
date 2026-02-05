import {
  encodeAbiParameters,
  encodeFunctionData,
  encodePacked,
  parseEther,
  parseUnits,
  type Address,
} from 'viem';
import { UNISWAP_V4_ADDRESSES, TICK_SPACINGS } from './config';
import { COMMON_TOKENS } from '@/lib/web3/config';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as Address;

// Universal Router ABI for v4 execute
const UNIVERSAL_ROUTER_ABI = [
  {
    inputs: [
      { name: 'commands', type: 'bytes' },
      { name: 'inputs', type: 'bytes[]' },
      { name: 'deadline', type: 'uint256' },
    ],
    name: 'execute',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const;

// ERC20 approve ABI
const ERC20_APPROVE_ABI = [
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export interface SwapParams {
  fromToken: string;
  toToken: string;
  amount: string;
  chainId: number;
  slippage: number;
  recipient: Address;
}

export interface SwapTransaction {
  to: Address;
  data: `0x${string}`;
  value: bigint;
  chainId: number;
}

export function buildApproveTransaction(
  tokenAddress: Address,
  spender: Address,
  amount: bigint,
  chainId: number
): SwapTransaction {
  const data = encodeFunctionData({
    abi: ERC20_APPROVE_ABI,
    functionName: 'approve',
    args: [spender, amount],
  });

  return { to: tokenAddress, data, value: 0n, chainId };
}

export function buildSwapTransaction(params: SwapParams): SwapTransaction {
  const { fromToken, toToken, amount, chainId, slippage, recipient } = params;
  const addresses = UNISWAP_V4_ADDRESSES[chainId as keyof typeof UNISWAP_V4_ADDRESSES];

  if (!addresses) {
    throw new Error(`Unsupported chain: ${chainId}`);
  }

  const tokens = COMMON_TOKENS[chainId];
  if (!tokens) throw new Error(`No tokens configured for chain ${chainId}`);

  const fromTokenInfo = tokens[fromToken];
  const toTokenInfo = tokens[toToken];
  if (!fromTokenInfo || !toTokenInfo) {
    throw new Error(`Token not found: ${fromToken} or ${toToken}`);
  }

  const isETHIn = fromToken === 'ETH';
  const amountIn = isETHIn
    ? parseEther(amount)
    : parseUnits(amount, fromTokenInfo.decimals);

  // Calculate minimum output with slippage (0 for hackathon simplicity)
  const amountOutMinimum = 0n;

  // Sort tokens for PoolKey (currency0 < currency1)
  const addr0 = fromTokenInfo.address;
  const addr1 = toTokenInfo.address;
  const [currency0, currency1] =
    addr0.toLowerCase() < addr1.toLowerCase()
      ? [addr0, addr1]
      : [addr1, addr0];

  // Determine swap direction
  const zeroForOne = fromTokenInfo.address.toLowerCase() === currency0.toLowerCase();
  const inputCurrency = zeroForOne ? currency0 : currency1;
  const outputCurrency = zeroForOne ? currency1 : currency0;

  // Use medium fee tier (0.30%) with corresponding tick spacing
  const fee = 3000;
  const tickSpacing = TICK_SPACINGS[fee] || 60;

  // --- Inner v4 actions encoding ---

  // Actions: SWAP_EXACT_IN_SINGLE (0x06) + SETTLE_ALL (0x0c) + TAKE_ALL (0x0f)
  const actions = encodePacked(
    ['uint8', 'uint8', 'uint8'],
    [0x06, 0x0c, 0x0f]
  );

  // Param 0: SWAP_EXACT_IN_SINGLE
  const swapParam = encodeAbiParameters(
    [
      {
        type: 'tuple',
        components: [
          {
            name: 'poolKey',
            type: 'tuple',
            components: [
              { name: 'currency0', type: 'address' },
              { name: 'currency1', type: 'address' },
              { name: 'fee', type: 'uint24' },
              { name: 'tickSpacing', type: 'int24' },
              { name: 'hooks', type: 'address' },
            ],
          },
          { name: 'zeroForOne', type: 'bool' },
          { name: 'amountIn', type: 'uint128' },
          { name: 'amountOutMinimum', type: 'uint128' },
          { name: 'hookData', type: 'bytes' },
        ],
      },
    ],
    [
      {
        poolKey: {
          currency0: currency0 as Address,
          currency1: currency1 as Address,
          fee,
          tickSpacing,
          hooks: ZERO_ADDRESS,
        },
        zeroForOne,
        amountIn,
        amountOutMinimum,
        hookData: '0x',
      },
    ]
  );

  // Param 1: SETTLE_ALL (input currency, max amount)
  const settleParam = encodeAbiParameters(
    [{ type: 'address' }, { type: 'uint256' }],
    [inputCurrency as Address, amountIn]
  );

  // Param 2: TAKE_ALL (output currency, min amount)
  const takeParam = encodeAbiParameters(
    [{ type: 'address' }, { type: 'uint256' }],
    [outputCurrency as Address, amountOutMinimum]
  );

  // --- Outer V4_SWAP encoding ---

  // V4_SWAP input = abi.encode(actions, params[])
  const v4SwapInput = encodeAbiParameters(
    [{ type: 'bytes' }, { type: 'bytes[]' }],
    [actions, [swapParam, settleParam, takeParam]]
  );

  // Outer command: 0x10 = V4_SWAP
  const commands = '0x10' as `0x${string}`;
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 1800); // 30 min

  const data = encodeFunctionData({
    abi: UNIVERSAL_ROUTER_ABI,
    functionName: 'execute',
    args: [commands, [v4SwapInput], deadline],
  });

  return {
    to: addresses.UniversalRouter,
    data,
    value: isETHIn ? amountIn : 0n,
    chainId,
  };
}

export function estimateSwapGas(chainId: number): string {
  const gasEstimates: Record<number, string> = {
    1: '$8-15',
    8453: '$0.01-0.05',
    42161: '$0.10-0.30',
  };
  return gasEstimates[chainId] || '$1-5';
}
