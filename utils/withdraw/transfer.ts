import { encodeFunctionData, erc20Abi } from "viem";
import { USDC } from "../constants/addresses";


export const transfer = (to: `0x${string}`, amount: bigint ) => {
    const transferData = encodeFunctionData({
        abi: erc20Abi,
        functionName: "transfer",
        args: [(to), (amount)]
    })

    // Build the transactions
    const transferTx = {
        to: USDC,
        data: transferData,
    };
    return transferTx
}