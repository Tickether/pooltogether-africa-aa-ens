import { useState } from 'react'
import { useBiconomy } from '@/providers/BiconomyContext'
import { withdraw } from '@/utils/withdraw/withdraw'
import { parseUnits } from 'viem'
import { PaymasterMode } from '@biconomy/account'
import { usePostWithdraw } from './usePostWithdraw'

export const usePoolWithdraw = () => {
    
    const { smartAccount } = useBiconomy()
    const { postWithdraw } = usePostWithdraw()
    const [loading, setLoading] = useState<boolean>()
    
    const poolWithdraw = async (amountDollar: string, receiverAddress: `0x${string}`, ownerAddress: `0x${string}`) => {
        setLoading(true)
        const amountParsed = parseUnits(amountDollar!, 6)
        

        const tx = withdraw(amountParsed, receiverAddress, ownerAddress)

        // Send the transaction and get the transaction hash
        const userOpResponse = await smartAccount!.sendTransaction(tx, {
            paymasterServiceData: {mode: PaymasterMode.SPONSORED},
        });
        const { transactionHash } = await userOpResponse.waitForTxHash();
        console.log("Transaction Hash", transactionHash);
        const userOpReceipt  = await userOpResponse.wait();
        if(userOpReceipt.success == 'true') { 
            postWithdraw( ownerAddress!, receiverAddress, transactionHash!, amountDollar!, 'withdraw' )
            console.log("UserOp receipt", userOpReceipt)
            console.log("Transaction receipt", userOpReceipt.receipt)
    
        }
        setLoading(false)
        return transactionHash
    }
    return { loading, poolWithdraw }
}