import { encodeFunctionData } from "viem";
import { suPrzUSDC } from "../constants/addresses";
import { poolABI } from "../abis/poolABI";

export const deposit = (amount: bigint, address: `0x${string}`) => {
    const depositData = encodeFunctionData({
        abi: poolABI,
        functionName: 'deposit',
        args: [(amount), (address)]
    })

    // Build the transactions
    const depositTx = {
        to: suPrzUSDC,
        data: depositData,
    };
    return depositTx
}