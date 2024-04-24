import { encodeFunctionData, erc20Abi } from "viem"
import { USDC } from "../constants/addresses";



export const approveLifeTimeSwim = (spender: `0x${string}`) => {
    const approveData = encodeFunctionData({
        abi: erc20Abi,
        functionName: 'approve',
        args: [(spender), (BigInt('999999999999999999999999999999999999999999999999999999999999999999999999'))]
    })

    // Build the transactions
    const approveTx = {
        to: USDC,
        data: approveData,
    };
    return approveTx
}