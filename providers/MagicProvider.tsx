import { Magic as MagicBase } from 'magic-sdk'
import { ethers } from "ethers"

import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react'

export type Magic = MagicBase

type MagicContextType = {
    magic: Magic | undefined
    ethersProvider: any | undefined
};

const MagicContext = createContext<MagicContextType>({
    magic: undefined,
    ethersProvider: undefined,
});

export const useMagic = () => useContext(MagicContext);

export const MagicProvider = ({ children }: { children: ReactNode }) => {
    const [magic, setMagic] = useState<Magic | undefined>()
    const [ethersProvider, setEthers] = useState<any | undefined>()
  
    useEffect(() => {
        if (process.env.NEXT_PUBLIC_MAGIC_API_KEY) {
            const magic = new MagicBase(process.env.NEXT_PUBLIC_MAGIC_API_KEY, {
                /*
                network: {
                    rpcUrl: `https://optimism-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
                    chainId: 10, // or preferred chain
                },
                */
                network: {
                    rpcUrl: `https://optimism-goerli.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
                    chainId: 420, // or preferred chain
                },
            })
            setMagic(magic)
            setEthers(new ethers.providers.Web3Provider((magic as any)?.rpcProvider))
        }
    }, [])
  
    
    const value = useMemo(() => {
        return {
            magic,
            ethersProvider,
        };
    }, [magic, ethersProvider])
    
    return <MagicContext.Provider value={value}>{children}</MagicContext.Provider>
};
