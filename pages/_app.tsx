import { BiconomyProvider } from '@/hooks/BiconomyContext'
import { MagicProvider } from '@/hooks/MagicProvider'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return ( 
    <>
      <MagicProvider>
        <BiconomyProvider>
          <Component {...pageProps} />
        </BiconomyProvider>
      </MagicProvider>
    </>
  )
}
