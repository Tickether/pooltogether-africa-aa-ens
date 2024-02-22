'use client'


import { BiconomySmartAccountV2, createSmartAccountClient } from '@biconomy/account'
import type { ReactNode } from 'react'
import React, { useContext, useEffect, useState } from 'react'
import { WalletClient } from 'viem'
import { optimism, optimismSepolia } from 'viem/chains'
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { createWalletClient, custom } from 'viem';


type Props = {
    children: ReactNode,
}

interface BiconomyInterface {
    smartAccount?: BiconomySmartAccountV2;
    smartAccountAddress?: string;
};

const Biconomy = React.createContext<BiconomyInterface>({
    smartAccount: undefined,
    smartAccountAddress: undefined
});

export function useBiconomy () {
    return useContext(Biconomy);
};

export function BiconomyContext ({ children }: Props) {
    const [smartAccount, setSmartAccount] = useState<BiconomySmartAccountV2 | undefined>()
    const [smartAccountAddress, setSmartAccountAddress] = useState<string | undefined>()
    const {wallets} = useWallets();
    const {ready, authenticated} = usePrivy();

    const getWalletClient = async () => {
        
        const embeddedWallet = wallets[0]
        // Switch your wallet to your target chain before getting the viem WalletClient
        await embeddedWallet?.switchChain(optimismSepolia.id)

        // Get an EIP1193 provider from the user's wallet
        const ethereumProvider = await embeddedWallet?.getEthereumProvider()

        // Create a Viem wallet client from the EIP1193 provider
        const walletClient = createWalletClient({
            account: embeddedWallet?.address as `0x${string}`,
            chain: optimismSepolia,
            transport: custom(ethereumProvider)
        })
        return walletClient as WalletClient;
    }

    const createSmartAccount = async (walletClient: WalletClient) => {
        if (!walletClient) return;

        const smartAccount = await createSmartAccountClient({
            signer: walletClient,
            bundlerUrl: process.env.NEXT_PUBLIC_BICONOMY_BUNDLER_URL, // <-- Read about this at https://docs.biconomy.io/dashboard#bundler-url
            biconomyPaymasterApiKey: process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_URL, // <-- Read about at https://docs.biconomy.io/dashboard/paymaster
        });
      
        const address = await smartAccount.getAccountAddress();
        setSmartAccountAddress(address);
        setSmartAccount(smartAccount);
    };

    const readyOrNot = async () => {
        if (!ready || !authenticated) return;
        const embeddedWallet = wallets.find((wallet) => (wallet.walletClientType === 'privy'));
        const walletClient = await getWalletClient()
        if (embeddedWallet && !smartAccount) createSmartAccount(walletClient);
    }
    useEffect(() => {
        readyOrNot()
    }, [wallets]);

    return (
        <>
            <Biconomy.Provider value={{smartAccount: smartAccount, smartAccountAddress: smartAccountAddress}}>{children}</Biconomy.Provider>
        </>
    )
}


