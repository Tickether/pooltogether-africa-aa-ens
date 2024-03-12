import { privateKeyToAccount } from 'viem/accounts'
import { createPublicClient, createWalletClient, http } from 'viem'
import { arbitrumSepolia } from 'viem/chains'

const account = privateKeyToAccount(process.env.NEXT_PUBLIC_PRIVATE_KEY) 

export const publicClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(`https://arbitrum-sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`),
})

export const client = createWalletClient({
  account,
  chain: arbitrumSepolia,
  transport: http(`https://arbitrum-sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`),
})