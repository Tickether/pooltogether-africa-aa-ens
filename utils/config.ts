import { createConfig, http, cookieStorage, createStorage } from 'wagmi'
import { optimism, optimismSepolia } from 'wagmi/chains'

//export const chains=
export const config = createConfig({
  chains: [ optimism, optimismSepolia ],
  ssr: true,
  storage: createStorage({  
    storage: cookieStorage, 
  }),
  transports: {
    [optimism.id]: http(),
    [optimismSepolia.id]: http(),
  },
})

