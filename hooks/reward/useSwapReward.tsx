import { SWAP_ROUTER, WETH } from '@/utils/constants/addresses'
import { allowanceWETH } from '@/utils/deposit/allowance'
import { approveLifeTimeReward } from '@/utils/deposit/approve'
import { SwapRouterParams, swap } from '@/utils/reward/swap'
import { useState } from 'react'
import { PaymasterMode } from '@biconomy/account'
import { useBiconomy } from '@/providers/BiconomyContext'


export const useSwapReward = () => {
    
    const [loading, setLoading] = useState<boolean>(false)
    const { smartAccount } = useBiconomy()
    
    const swapReward = async (swapRouterParams: SwapRouterParams) => {
        try {
            setLoading(true)
            const amountInParsed = swapRouterParams.amountIn
            const allowance_ = await allowanceWETH(swapRouterParams.recipient, SWAP_ROUTER)
            let userOpResponse
            let txnHash
            if (amountInParsed < allowance_ || allowance_ == BigInt(0)) {
                // send two
                const tx = []
                const tx1 = approveLifeTimeReward(SWAP_ROUTER)
                tx.push(tx1)
                const tx2 = swap(swapRouterParams)
                tx.push(tx2)
                // Send the transaction and get the transaction hash
                userOpResponse = await smartAccount!.sendTransaction(tx, {
                    paymasterServiceData: {mode: PaymasterMode.SPONSORED},
                });
                const { transactionHash } = await userOpResponse.waitForTxHash();
                console.log("Transaction Hash", transactionHash);
                txnHash = transactionHash
            } else {
                // send one
                const tx = swap(swapRouterParams)
                // Send the transaction and get the transaction hash
                userOpResponse = await smartAccount!.sendTransaction(tx, {
                    paymasterServiceData: {mode: PaymasterMode.SPONSORED},
                });
                const { transactionHash } = await userOpResponse.waitForTxHash();
                console.log("Transaction Hash", transactionHash);
                txnHash = transactionHash
            }


            const userOpReceipt  = await userOpResponse?.wait();
            if(userOpReceipt?.success == 'true') { 
                console.log("UserOp receipt", userOpReceipt)
                console.log("Transaction receipt", userOpReceipt?.receipt)
            }
            setLoading(false)
            return txnHash
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
    return { loading, swapReward }
}