import { useState, useMemo, useEffect, useContext, createContext, ReactNode } from "react"
import { IBundler, Bundler } from '@biconomy/bundler'
import { IPaymaster, BiconomyPaymaster } from '@biconomy/paymaster'
import { ChainId } from "@biconomy/core-types"
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS  } from "@biconomy/account"
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE } from "@biconomy/modules"
import { useMagic } from "./MagicProvider"


interface BiconomyInterface {
    smartAccount?: BiconomySmartAccountV2
    smartAccountAddress?: string
}

const BiconomyContext = createContext<BiconomyInterface>({
    smartAccount: undefined,
    smartAccountAddress: undefined,
})

export const useBiconomy = () => {
    return useContext(BiconomyContext)
}

export const BiconomyProvider = ({ children }: { children: ReactNode }) => {
    const {magic, ethersProvider} = useMagic()
    const [smartAccount, setSmartAccount] = useState<BiconomySmartAccountV2 | undefined>()
    const [smartAccountAddress, setSmartAccountAddress] = useState<string | undefined>()
    const [connected, setConnected] = useState<boolean | null>(null)
    
    let getHexTimeOut : NodeJS.Timeout
    const doHex = async () => {
        try {
            const isLoggedIn = await magic?.user.isLoggedIn()
            setConnected(isLoggedIn!)
            console.log('isLoggedIn:', isLoggedIn!)
            getHexTimeOut = setTimeout(doHex, 666)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        if (magic && ethersProvider) {
            doHex()
        }
        return () => clearTimeout(getHexTimeOut)
    },[magic, ethersProvider])
    
    

    
    const bundler: IBundler = useMemo(() => new Bundler({
        bundlerUrl: process.env.NEXT_PUBLIC_BICONOMY_BUNDLER_URL,
        chainId: ChainId.OPTIMISM_MAINNET,
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    }), [])

    const paymaster: IPaymaster = useMemo(() => new BiconomyPaymaster({
        paymasterUrl: process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_URL,
    }), [])

    
    const createBiconomyAccount = async () => {
        const validationModule = await ECDSAOwnershipValidationModule.create({
            signer: ethersProvider!.getSigner()!,
            moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE
        })

        const biconomySmartAccount = await BiconomySmartAccountV2.create({
            provider: ethersProvider!,
            chainId: ChainId.OPTIMISM_MAINNET,
            bundler: bundler,
            paymaster: paymaster,
            entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
            defaultValidationModule: validationModule,
            activeValidationModule: validationModule,
            rpcUrl: `https://optimism-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`
        })

        setSmartAccount(biconomySmartAccount)
        const address = await biconomySmartAccount.getAccountAddress()
        setSmartAccountAddress(address)
    }
    const logoutBiconomyAccount = async () => {
        setSmartAccount(undefined)
        setSmartAccountAddress(undefined)
    }    

    useEffect(() => {
        if (connected && !smartAccount) createBiconomyAccount()
        if (!connected && smartAccount) logoutBiconomyAccount()
    }, [connected])
    
    const value = useMemo(() => {
        return {
          smartAccount, 
          smartAccountAddress
        }
    }, [ smartAccount, smartAccountAddress ])
    

    return (
        <BiconomyContext.Provider value={value}>{children}</BiconomyContext.Provider>
    )
}