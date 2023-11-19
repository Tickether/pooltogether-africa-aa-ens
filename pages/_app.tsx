import { MagicBiconomyProvider } from '@/hooks/MagicBiconomyProvider'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return ( 
    <>
      
        <MagicBiconomyProvider>
          <Component {...pageProps} />
        </MagicBiconomyProvider>
      
    </>
  )
}
