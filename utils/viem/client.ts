import { privateKeyToAccount } from 'viem/accounts'
import { createPublicClient, createWalletClient, http } from 'viem'
import { optimism, optimismGoerli } from 'viem/chains'

const account = privateKeyToAccount(process.env.NEXT_PUBLIC_PRIVATE_KEY) 

export const publicClient = createPublicClient({
  chain: optimismGoerli,
  transport: http(`https://optimism-goerli.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`),
  //transport: http(`https://optimism-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`),
})

export const client = createWalletClient({
  account,
  chain: optimismGoerli,
  transport: http(`https://optimism-goerli.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`),
  //transport: http(`https://optimism-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`),
})