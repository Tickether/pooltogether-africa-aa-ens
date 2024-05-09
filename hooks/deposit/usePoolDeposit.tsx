'use client'

import { useState } from 'react'
import { przUSDC } from '@/utils/constants/addresses'
import { allowance } from '@/utils/deposit/allowance'
import { parseUnits } from 'viem'
import { PaymasterMode } from '@biconomy/account'
import { approveLifeTimeSwim } from '@/utils/deposit/approve'
import { deposit } from '@/utils/deposit/deposit'
import { useBiconomy } from '@/providers/BiconomyContext'

export const usePoolDeposit = () => {
    
    const [loading, setLoading] = useState<boolean>()
    const { smartAccount } = useBiconomy()

    const poolDeposit = async (amountDollar: string, smartAccountAddress: `0x${string}`) => {
        setLoading(true)
        const amountParsed = parseUnits(amountDollar!, 6)
        const allowance_ = await allowance(smartAccountAddress, przUSDC)
        let userOpResponse
        let txnHash
        if (amountParsed < allowance_ || allowance_ == BigInt(0)) {
            // send two
            const tx = []
            const tx1 = approveLifeTimeSwim(przUSDC)
            tx.push(tx1)
            const tx2 = deposit(amountParsed, smartAccountAddress)
            tx.push(tx2)
            // Send the transaction and get the transaction hash
            const userOpResponse = await smartAccount!.sendTransaction(tx, {
                paymasterServiceData: {mode: PaymasterMode.SPONSORED},
            });
            const { transactionHash } = await userOpResponse.waitForTxHash();
            console.log("Transaction Hash", transactionHash);
            txnHash = transactionHash

        }else {
            // send one
            const tx = deposit(amountParsed, smartAccountAddress)
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
            //save offchain depo info
            //await updateDeposit(ref, txnHash!, 'success')
        }
        setLoading(false)
    }
    return { loading, poolDeposit }
}