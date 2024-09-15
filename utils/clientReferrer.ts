import { Chain, createPublicClient, createWalletClient, http } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'


const account = privateKeyToAccount(process.env.PRIVATE_KEY) 

export const publicClient = createPublicClient({
  chain: baseSepolia as Chain,
  transport: http()
})

export const walletClient = createWalletClient({
  account,
  chain: baseSepolia as Chain,
  transport: http()
})
