import { privateKeyToAccount } from 'viem/accounts'
import { createPublicClient, createWalletClient, http } from 'viem'
import { optimism } from 'viem/chains'

export const account = privateKeyToAccount(process.env.PRIVATE_KEY) 

export const publicClient = createPublicClient({
  chain: optimism,
  transport: http(`https://optimism-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`),
})

export const client = createWalletClient({
  account,
  chain: optimism,
  transport: http(`https://optimism-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`),
})