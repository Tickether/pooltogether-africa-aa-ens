import { useMagicBiconomy } from '@/hooks/MagicBiconomyProvider'
import { erc20ABI, useContractRead } from 'wagmi'


export default function Susu() {
    const { smartAccount, smartAccountAddress } = useMagicBiconomy()
    const s = '0xf61B86786Bd230cc86FeFA82874369c8D915AE90' 
    const readPTAfricaBalance = useContractRead({
        address: '0xE3B3a464ee575E8E25D2508918383b89c832f275', //pUSDC.e
        abi: erc20ABI,
        functionName: 'balanceOf',
        args:[(`0x${s?.slice(2)}`)],
        chainId: 10,
    })
    console.log(readPTAfricaBalance?.data)
    
    return(
        <>
        <div>
            0
        </div>
        </>
    )
}