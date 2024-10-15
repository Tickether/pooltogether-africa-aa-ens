import { Chain, createPublicClient, createWalletClient, http } from 'viem'
import { base } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'


const account = privateKeyToAccount(process.env.PRIVATE_KEY) 

export const publicClient = createPublicClient({
  chain: base as Chain,
  transport: http()
})

export const walletClient = createWalletClient({
  account,
  chain: base as Chain,
  transport: http()
})
