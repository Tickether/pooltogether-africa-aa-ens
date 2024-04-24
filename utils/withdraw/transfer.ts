import { encodeFunctionData, erc20Abi } from "viem";
import { USDC, przUSDC } from "../constants/addresses";
import { poolABI } from "../abis/poolABI";

export const transfer = (address: `0x${string}`, amount: bigint ) => {
    const transferData = encodeFunctionData({
        abi: erc20Abi,
        functionName: 'transfer',
        args: [(address), (amount)]
    })

    // Build the transactions
    const transferTx = {
        to: USDC,
        data: transferData,
    };
    return transferTx
}