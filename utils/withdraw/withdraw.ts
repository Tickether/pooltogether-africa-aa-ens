import { encodeFunctionData } from "viem";
import { przUSDC } from "../constants/addresses";
import { poolABI } from "../abis/poolABI";

export const withdraw = (amount: bigint, receiverAddress: `0x${string}`,  ownerAddress: `0x${string}`) => {
    const withdrawData = encodeFunctionData({
        abi: poolABI,
        functionName: 'withdraw',
        args: [(amount), (receiverAddress), (ownerAddress)]
    })

    // Build the transactions
    const withdrawTx = {
        to: przUSDC,
        data: withdrawData,
    };
    return withdrawTx
}