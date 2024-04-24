import { encodeFunctionData } from "viem";
import { przUSDC } from "../constants/addresses";
import { poolABI } from "../abis/poolABI";

export const withdraw = (amount: bigint, address: `0x${string}`) => {
    const withdrawData = encodeFunctionData({
        abi: poolABI,
        functionName: 'withdraw',
        args: [(amount), (address), (address)]
    })

    // Build the transactions
    const withdrawTx = {
        to: przUSDC,
        data: withdrawData,
    };
    return withdrawTx
}