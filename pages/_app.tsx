import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { optimism, optimismGoerli } from 'wagmi/chains'
import { infuraProvider } from 'wagmi/providers/infura'
import { BiconomyProvider } from '@/providers/BiconomyProvider'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { MagicProvider } from '@/providers/MagicProvider'

export default function App({ Component, pageProps }: AppProps) {
  const { publicClient } = configureChains(
    [optimism, optimismGoerli],
    [infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY })],
  )
  const config = createConfig({
    autoConnect: false,
    publicClient,
  })

  return ( 
    <>
    <WagmiConfig config={config}>
      <MagicProvider>
        <BiconomyProvider>
          <Component {...pageProps} />
        </BiconomyProvider>
      </MagicProvider>
    </WagmiConfig>
    </>
  )
}
