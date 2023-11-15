import { MagicProvider } from '@/hooks/MagicProvider'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return ( 
    <>
      <MagicProvider>
        <Component {...pageProps} />
      </MagicProvider>
    </>
  )
}
