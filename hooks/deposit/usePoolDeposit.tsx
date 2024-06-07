'use client'

import { useState } from 'react'
import { przDepositBot, przUSDC } from '@/utils/constants/addresses'
import { allowanceUSD } from '@/utils/deposit/allowance'
import { parseUnits } from 'viem'
import { PaymasterMode } from '@biconomy/account'
import { approveLifeTimeSwim } from '@/utils/deposit/approve'
import { deposit } from '@/utils/deposit/deposit'
import { useBiconomy } from '@/providers/BiconomyContext'
import { hook } from '@/utils/deposit/hook'

export const usePoolDeposit = () => {
    
    const [loading, setLoading] = useState<boolean>(false)
    const { smartAccount } = useBiconomy()

    const poolDeposit = async (amountDollar: string, smartAccountAddress: `0x${string}`) => {
        
        try {
            setLoading(true)
            const amountParsed = parseUnits(amountDollar!, 6)
            const allowance_ = await allowanceUSD(smartAccountAddress, przUSDC)
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
                userOpResponse = await smartAccount!.sendTransaction(tx, {
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
            }
            setLoading(false)
            return txnHash 
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
        
        
    }
    const poolApproveHook = async () => {
        
        try {
            //setLoading(true)
            let tx = []
            const approveTx = approveLifeTimeSwim(przDepositBot)
            tx.push(approveTx)
            const hookTx = hook()
            tx.push(hookTx)


            // Send the transaction and get the transaction hash
            const userOpResponse = await smartAccount!.sendTransaction(tx, {
                paymasterServiceData: {mode: PaymasterMode.SPONSORED},
            });
            const { transactionHash } = await userOpResponse.waitForTxHash();
            console.log("Transaction Hash", transactionHash);
    
            
            const userOpReceipt  = await userOpResponse?.wait();
            if(userOpReceipt?.success == 'true') { 
                console.log("UserOp receipt", userOpReceipt)
                console.log("Transaction receipt", userOpReceipt?.receipt)
            }
            //setLoading(false)
            return transactionHash 
        } catch (error) {
            console.log(error)
            //setLoading(false)
        }
        
        
    }
    
    return { loading, poolDeposit, poolApproveHook }
}