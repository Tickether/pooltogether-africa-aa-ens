'use client'

//import '@/styles/globals.css'
//import '@rainbow-me/rainbowkit/styles.css'
import { polygonMumbai, optimismGoerli, optimism } from 'wagmi/chains'
import { infuraProvider } from 'wagmi/providers/infura'
import { WagmiConfig, configureChains, createConfig } from "wagmi"
import { googleWallet, facebookWallet, githubWallet, discordWallet, twitterWallet } from '@zerodev/wagmi/rainbowkit'
//import { connectorsForWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { 
  GoogleSocialWalletConnector, 
  FacebookSocialWalletConnector, 
  GithubSocialWalletConnector,
  DiscordSocialWalletConnector,
  TwitchSocialWalletConnector,
  TwitterSocialWalletConnector,
} from '@zerodev/wagmi'


import { ReactNode, useEffect, useState } from 'react'
export const { chains, publicClient, webSocketPublicClient } = configureChains(
    [optimismGoerli],
    [infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY })],
)

export default function Providers({ children }: { children: ReactNode }) {
    const [config] = useState(() => {
        if (typeof window !== 'undefined') {
          const options = { chains, options: { projectId: process.env.NEXT_PUBLIC_ZERO_DEV_PROJECT_ID, shimDisconnect: true } } 
          return (
            createConfig({
              autoConnect: true,
              
              connectors: [
                new GoogleSocialWalletConnector(options),
                new FacebookSocialWalletConnector(options),
                new GithubSocialWalletConnector(options),
                new DiscordSocialWalletConnector(options),
                new TwitchSocialWalletConnector(options),
                new TwitterSocialWalletConnector(options),
              ],
              /*
              connectors: connectorsForWallets([
                {
                  groupName: 'Social',
                    wallets: [
                      googleWallet({chains, options: { shimDisconnect: true, projectId : process.env.NEXT_PUBLIC_ZERO_DEV_PROJECT_ID }}),
                      facebookWallet({chains, options: { shimDisconnect: true, projectId : process.env.NEXT_PUBLIC_ZERO_DEV_PROJECT_ID }}),
                      githubWallet({chains, options: { shimDisconnect: true, projectId : process.env.NEXT_PUBLIC_ZERO_DEV_PROJECT_ID }}),
                      discordWallet({chains, options: { shimDisconnect: true, projectId : process.env.NEXT_PUBLIC_ZERO_DEV_PROJECT_ID }}),
                      twitterWallet({chains, options: { shimDisconnect: true, projectId : process.env.NEXT_PUBLIC_ZERO_DEV_PROJECT_ID }}),
                  ],
                },
              ]),
              */
              publicClient,
              webSocketPublicClient,
            })
          )
        }
    })
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    if (typeof window === 'undefined') return null

    return (
        <>
          <WagmiConfig config={config!}>
            {mounted && children}
          </WagmiConfig>
        </>
      )
}