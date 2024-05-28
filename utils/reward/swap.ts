import { encodeFunctionData } from "viem";
import { swapRouterABI } from "../abis/swapRouterABI";
import { SWAP_ROUTER } from "../constants/addresses";

export interface SwapRouterParams {
    tokenIn: `0x${string}`,
    tokenOut: `0x${string}`,
    fee: number,
    recipient: `0x${string}`,
    amountIn: bigint,
    amountOutMinimum: bigint,
    sqrtPriceLimitX96: bigint
}

export const swap = (swapRouterParams: SwapRouterParams) => {
    const swapData = encodeFunctionData({
        abi: swapRouterABI,
        functionName: 'exactInputSingle',
        args: [(swapRouterParams)]
    })

    // Build the transactions
    const swapTx = {
        to: SWAP_ROUTER,
        data: swapData,
    };
    
    return swapTx
}