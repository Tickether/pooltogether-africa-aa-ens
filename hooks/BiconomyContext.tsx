'use client'

import { useState, useMemo, useEffect, useContext, createContext, ReactNode } from "react";
import { IBundler, Bundler } from '@biconomy/bundler';
import { IPaymaster, BiconomyPaymaster } from '@biconomy/paymaster';
import { ChainId } from "@biconomy/core-types";
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS  } from "@biconomy/account";
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE } from "@biconomy/modules";
import { useMagic } from "./MagicProvider";
import { ethers } from "ethers";


interface BiconomyInterface {
    smartAccount?: BiconomySmartAccountV2;
    smartAccountAddress?: string;
};

const BiconomyContext = createContext<BiconomyInterface>({
    smartAccount: undefined,
    smartAccountAddress: undefined
});

export const useBiconomy = () => {
    return useContext(BiconomyContext);
};

export const BiconomyProvider = ({ children }: { children: ReactNode }) => {
    const { magic } = useMagic();
    const [smartAccount, setSmartAccount] = useState<BiconomySmartAccountV2 | undefined>();
    const [smartAccountAddress, setSmartAccountAddress] = useState<string | undefined>();


    const bundler: IBundler = useMemo(() => new Bundler({
        bundlerUrl: process.env.NEXT_PUBLIC_BICONOMY_BUNDLER_URL,
        chainId: ChainId.OPTIMISM_MAINNET,
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    }), []);

    const paymaster: IPaymaster = useMemo(() => new BiconomyPaymaster({
        paymasterUrl: process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_URL,
    }), []);

    
    const createBiconomyAccount = async () => {
        
        await magic?.wallet.connectWithUI()
        
        const provider =  new ethers.providers.Web3Provider(
            (magic as any)?.rpcProvider,
            "any"
        );

        const validationModule = await ECDSAOwnershipValidationModule.create({
            signer: provider.getSigner(),
            moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE
        });

        const biconomySmartAccount = await BiconomySmartAccountV2.create({
            provider: provider,
            chainId: ChainId.OPTIMISM_MAINNET,
            bundler: bundler,
            paymaster: paymaster,
            entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
            defaultValidationModule: validationModule,
            activeValidationModule: validationModule,
            rpcUrl: `https://optimism-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`
        });


        setSmartAccount(biconomySmartAccount);
        const address = await biconomySmartAccount.getAccountAddress();
        setSmartAccountAddress(address);
    }
    
    useEffect(() => {
        //if (!ready || !authenticated) return;
        //const embeddedWallet = wallets.find((wallet) => (wallet.walletClientType === 'privy'));
        if (!smartAccount) createBiconomyAccount();
    }, []);
    

    return (
        <BiconomyContext.Provider value={{smartAccount: smartAccount, smartAccountAddress: smartAccountAddress}}>{children}</BiconomyContext.Provider>
    );
};