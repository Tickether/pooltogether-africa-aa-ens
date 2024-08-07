import { encodeFunctionData } from "viem";
import { przRedirectHook, suPrzUSDC } from "../constants/addresses";
import { vaultABI } from "@generationsoftware/hyperstructure-client-js"

export const hook = () => {
    const hook = {
        useBeforeClaimPrize: (true), 
        useAfterClaimPrize: (false), 
        implementation: (przRedirectHook)
    }
    const hookData = encodeFunctionData({
        abi: vaultABI,
        functionName: "setHooks",
        args: [(hook)]
    })

    // Build the transactions
    const hookTx = {
        to: suPrzUSDC,
        data: hookData,
    };
    return hookTx
}