import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { optimism } from 'wagmi/chains'
import { infuraProvider } from 'wagmi/providers/infura'
import { MagicBiconomyProvider } from '@/hooks/MagicBiconomyProvider'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  const { publicClient } = configureChains(
    [optimism],
    [infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY })],
  )
  const config = createConfig({
    autoConnect: false,
    publicClient,
  })

  return ( 
    <>
    <WagmiConfig config={config}>
      <MagicBiconomyProvider>
        <Component {...pageProps} />
      </MagicBiconomyProvider>
    </WagmiConfig>
    </>
  )
}
