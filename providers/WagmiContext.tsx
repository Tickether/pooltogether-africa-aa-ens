'use client'


import { QueryClient, QueryClientProvider } from '@tanstack/react-query' 
import type { ReactNode } from 'react'
import { type State, WagmiProvider } from 'wagmi'
import { config } from '@/utils/config'


type Props = {
    children: ReactNode,
    initialState: State, 
}

const queryClient = new QueryClient() 

export function WagmiContext ({ children, initialState }: Props) {

    return (
        <>
            <WagmiProvider config={config} initialState={initialState}>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </WagmiProvider>
        </>
    )
}


