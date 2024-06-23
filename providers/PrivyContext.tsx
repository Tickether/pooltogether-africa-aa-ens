'use client'


import { PrivyProvider } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { base } from 'viem/chains'


type Props = {
    children: ReactNode,
}

export function PrivyContext ({ children }: Props) {

    const router = useRouter()

    return (
        <>
            <PrivyProvider
                appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
                onSuccess={() => router.push('/susu')}
                config={{
                    /* Replace this with your desired login methods */
                    loginMethods: ['email','wallet'],
                    /* Replace this with your desired appearance configuration */
                    appearance: {
                        theme: 'light',
                        accentColor: '#0C3FFF',
                        logo: 'https://i.ibb.co/mttPXst/susuclub.png',
                        showWalletLoginFirst: true,
                        walletList: ['coinbase_wallet'], 

                    },
                    defaultChain: base,
                    supportedChains: [base],
                    embeddedWallets: {
                        createOnLogin: 'users-without-wallets',
                        noPromptOnSignature: true
                    },
                    externalWallets: { 
                        coinbaseWallet: { 
                          // Valid connection options include 'eoaOnly' (default), 'smartWalletOnly', or 'all'
                          connectionOptions: 'smartWalletOnly', 
                        },
                    },     
                }}
            >
                {children}
            </PrivyProvider>
        </>
    )
}
