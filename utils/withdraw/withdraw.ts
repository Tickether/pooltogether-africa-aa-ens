import { encodeFunctionData } from "viem";
import { suPrzUSDC } from "../constants/addresses";
import { vaultABI } from "@generationsoftware/hyperstructure-client-js";

export const withdraw = (amount: bigint, receiverAddress: `0x${string}`,  ownerAddress: `0x${string}`) => {
    const withdrawData = encodeFunctionData({
        abi: vaultABI,
        functionName: "withdraw",
        args: [(amount), (receiverAddress), (ownerAddress)]
    })

    // Build the transactions
    const withdrawTx = {
        to: suPrzUSDC,
        data: withdrawData,
    };
    return withdrawTx
}