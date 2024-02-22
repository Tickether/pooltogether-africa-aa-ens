'use client'


import { PrivyProvider } from '@privy-io/react-auth'
import type { ReactNode } from 'react'


type Props = {
    children: ReactNode,
}

export function PrivyContext ({ children }: Props) {

    return (
        <>
            <PrivyProvider
                appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
                config={{
                    /* Replace this with your desired login methods */
                    loginMethods: ['email', 'google', 'apple', 'discord'],
                    /* Replace this with your desired appearance configuration */
                    appearance: {
                        theme: 'light',
                        accentColor: '#676FFF',
                        logo: '',
                        showWalletLoginFirst: false,

                    },
                    embeddedWallets: {
                        createOnLogin: 'users-without-wallets',
                        noPromptOnSignature: true
                    },    
                }}
            >
                {children}
            </PrivyProvider>
        </>
    )
}