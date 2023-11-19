import { ethers } from 'ethers';
import { Magic as MagicBase } from 'magic-sdk';
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';


export type Magic = MagicBase;

type MagicContextType = {
  magic: Magic | null;
  ethersProvider: any | null;
};

const MagicContext = createContext<MagicContextType>({
  magic: null,
  ethersProvider: null,
});

export const useMagic = () => useContext(MagicContext);

export const MagicProvider = ({ children }: { children: ReactNode }) => {
  const [magic, setMagic] = useState<Magic | null>(null)
  const [ethersProvider, setEthers] = useState<any | null>(null)

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MAGIC_API_KEY) {
      const magic = new MagicBase(process.env.NEXT_PUBLIC_MAGIC_API_KEY, {
        network: {
            rpcUrl: `https://optimism-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
            chainId: 10, // or preferred chain
        },
      });
      setMagic(magic);
      if (magic) {
        setEthers(new ethers.providers.Web3Provider((magic as any)?.rpcProvider))
      }
    }
  }, []);

  const value = useMemo(() => {
    return {
      magic,
      ethersProvider
    };
  }, [magic, ethersProvider]);

  return <MagicContext.Provider value={value}>{children}</MagicContext.Provider>;
};