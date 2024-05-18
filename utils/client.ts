import { privateKeyToAccount } from 'viem/accounts'
import { createPublicClient, createWalletClient, http } from 'viem'
import { optimism, mainnet} from 'viem/chains'



export const publicClient = createPublicClient({
  chain: optimism,
  transport: http(`https://optimism-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`),
})

export const publicClientMainnet = createPublicClient({
  chain: mainnet,
  transport: http(),
})