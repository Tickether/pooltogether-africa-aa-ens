import { erc20Abi } from "viem"
import { publicClient } from "../client"
import { USDC } from "../constants/addresses"

export const allowance = async (owner: `0x${string}`, spender: `0x${string}`) => {

    const allowanceData = await publicClient.readContract({
        address: USDC,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [(owner), (spender)]
    })

    return allowanceData
    
}