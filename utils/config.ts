import { createConfig, http, cookieStorage, createStorage } from 'wagmi'
import { arbitrumSepolia } from 'wagmi/chains'

//export const chains=
export const config = createConfig({
  chains: [ arbitrumSepolia ],
  ssr: true,
  storage: createStorage({  
    storage: cookieStorage, 
  }),
  transports: {
    [arbitrumSepolia.id]: http(),
  },
})

