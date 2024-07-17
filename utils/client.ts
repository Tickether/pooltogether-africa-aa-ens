import { createPublicClient, http } from "viem"
import { base, mainnet} from "viem/chains"



export const publicClient = createPublicClient({
  chain: base,
  transport: http(),
})

export const publicClientMainnet = createPublicClient({
  chain: mainnet,
  transport: http(),
})