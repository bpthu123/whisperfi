import { createPublicClient, http, namehash, encodeFunctionData } from 'viem';
import { normalize } from 'viem/ens';
import { mainnet } from 'viem/chains';

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(
    process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
      ? `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
      : undefined
  ),
});

// ENS Public Resolver on mainnet
const ENS_PUBLIC_RESOLVER = '0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63' as `0x${string}`;

const RESOLVER_SET_TEXT_ABI = [
  {
    inputs: [
      { name: 'node', type: 'bytes32' },
      { name: 'key', type: 'string' },
      { name: 'value', type: 'string' },
    ],
    name: 'setText',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export async function resolveENSName(address: `0x${string}`): Promise<string | null> {
  try {
    const name = await publicClient.getEnsName({ address });
    return name;
  } catch {
    return null;
  }
}

export async function resolveENSAddress(name: string): Promise<`0x${string}` | null> {
  try {
    const address = await publicClient.getEnsAddress({ name: normalize(name) });
    return address;
  } catch {
    return null;
  }
}

export async function getENSAvatar(name: string): Promise<string | null> {
  try {
    const avatar = await publicClient.getEnsAvatar({ name: normalize(name) });
    return avatar;
  } catch {
    return null;
  }
}

export async function getENSTextRecord(name: string, key: string): Promise<string | null> {
  try {
    const record = await publicClient.getEnsText({
      name: normalize(name),
      key,
    });
    return record;
  } catch {
    return null;
  }
}

/**
 * Build a transaction to set an ENS text record via the Public Resolver.
 * Returns the transaction data for wallet signing.
 */
export function buildSetTextTransaction(ensNameRaw: string, key: string, value: string) {
  const normalized = normalize(ensNameRaw);
  const node = namehash(normalized);

  const data = encodeFunctionData({
    abi: RESOLVER_SET_TEXT_ABI,
    functionName: 'setText',
    args: [node, key, value],
  });

  return {
    to: ENS_PUBLIC_RESOLVER,
    data,
    value: 0n,
    chainId: 1, // mainnet only
  };
}

