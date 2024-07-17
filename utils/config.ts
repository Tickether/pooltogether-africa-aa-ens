import { createConfig, http, cookieStorage, createStorage } from "wagmi"
import { base } from "wagmi/chains"

//export const chains=
export const config = createConfig({
  chains: [ base ],
  ssr: true,
  storage: createStorage({  
    storage: cookieStorage, 
  }),
  transports: {
    [base.id]: http(),
  },
})

