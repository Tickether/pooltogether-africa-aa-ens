import { privateKeyToAccount } from 'viem/accounts'
import { createPublicClient, createWalletClient, http } from 'viem'
import { optimism, mainnet} from 'viem/chains'



export const publicClient = createPublicClient({
  chain: optimism,
  transport: http(),
})

export const publicClientMainnet = createPublicClient({
  chain: mainnet,
  transport: http(),
})