import { createClient, http } from 'viem'
import { optimism } from 'viem/chains'


export const client = createClient({
  chain: optimism,
  transport: http(`https://optimism-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`),
})