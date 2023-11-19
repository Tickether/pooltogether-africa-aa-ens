
import { Magic as MagicBase } from 'magic-sdk';
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { IBundler, Bundler } from '@biconomy/bundler';
import { IPaymaster, BiconomyPaymaster } from '@biconomy/paymaster';
import { ChainId } from "@biconomy/core-types";
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS  } from "@biconomy/account";
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE } from "@biconomy/modules";
import { ethers } from "ethers";

export type Magic = MagicBase;

type MagicContextType = {
  magic: Magic | null;
  smartAccount?: BiconomySmartAccountV2;
  smartAccountAddress?: string;
  logoutBiconomyAccount: () => void
  createBiconomyAccount: () => void
};

const MagicContext = createContext<MagicContextType>({
  magic: null,
  smartAccount: undefined,
  smartAccountAddress: undefined,
  logoutBiconomyAccount: () => {},
  createBiconomyAccount: () => {},
});

export const useMagic = () => useContext(MagicContext);

const MagicProvider = ({ children }: { children: ReactNode }) => {
  const [magic, setMagic] = useState<Magic | null>(null)
  const [ethersProvider, setEthers] = useState<any | null>(null)
  const [smartAccount, setSmartAccount] = useState<BiconomySmartAccountV2 | undefined>(undefined);
  const [smartAccountAddress, setSmartAccountAddress] = useState<string | undefined>(undefined);

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
      //setWeb3(new Web3((magic as any).rpcProvider));
    }
  }, []);

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
  
        const validationModule = await ECDSAOwnershipValidationModule.create({
            signer: ethersProvider!.getSigner()!,
            moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE
        });

        const biconomySmartAccount = await BiconomySmartAccountV2.create({
            provider: ethersProvider!,
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
const logoutBiconomyAccount = async () => {
    setSmartAccount(undefined);
    setSmartAccountAddress(undefined);
}

  const value = useMemo(() => {
    return {
      magic,
      smartAccount, 
      smartAccountAddress,
      logoutBiconomyAccount,
      createBiconomyAccount
    };
  }, [magic, smartAccount, smartAccountAddress, logoutBiconomyAccount, createBiconomyAccount]);

  return <MagicContext.Provider value={value}>{children}</MagicContext.Provider>;
};

export default MagicProvider;
