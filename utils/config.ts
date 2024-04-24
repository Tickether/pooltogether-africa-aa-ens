import { createConfig, http, cookieStorage, createStorage } from 'wagmi'
import { optimism } from 'wagmi/chains'

//export const chains=
export const config = createConfig({
  chains: [ optimism ],
  ssr: true,
  storage: createStorage({  
    storage: cookieStorage, 
  }),
  transports: {
    [optimism.id]: http(),
  },
})

