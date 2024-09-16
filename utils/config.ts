import { createConfig, http, cookieStorage, createStorage } from "wagmi"
import { base, baseSepolia } from "wagmi/chains"

//export const chains=
export const config = createConfig({
  chains: [ base, baseSepolia ],
  ssr: true,
  storage: createStorage({  
    storage: cookieStorage, 
  }),
  transports: {
    [base.id]: http(`https://api.developer.coinbase.com/rpc/v1/base/${process.env.NEXT_PUBLIC_BASE_NODE_API_KEY}`),
    [baseSepolia.id]: http()
  },
})

