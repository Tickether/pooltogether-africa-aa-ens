import { useState } from 'react'
import { useBiconomy } from '@/providers/BiconomyContext'
import { withdraw } from '@/utils/withdraw/withdraw'
import { transfer } from '@/utils/withdraw/transfer'
import { Country } from '@/utils/constants/countries'
import { parseUnits } from 'viem'
import { PaymasterMode } from '@biconomy/account'

export const usePoolWithdraw = () => {
    
    const { smartAccount } = useBiconomy()
    
    const poolWithdraw = async (amountDollar: string, smartAccountAddress: `0x${string}`, country: Country) => {
        const amountParsed = parseUnits(amountDollar!, 6)

        let tx = []
        const tx1 = withdraw(amountParsed, smartAccountAddress)
        tx.push(tx1)
        const tx2 = transfer(smartAccountAddress, amountParsed)
        //replace address here with Cashramp EScrow
        tx.push(tx2)

        // Send the transaction and get the transaction hash
        const userOpResponse = await smartAccount!.sendTransaction(tx, {
            paymasterServiceData: {mode: PaymasterMode.SPONSORED},
        });
        const { transactionHash } = await userOpResponse.waitForTxHash();
        console.log("Transaction Hash", transactionHash);
        const userOpReceipt  = await userOpResponse.wait();
        if(userOpReceipt.success == 'true') { 
            //postWithdraw( smartAccountAddress!, transactionHash!, '', amountDollar!, amountLocal!, country.currency, rates?.withdrawalRate!, 'pending' )
            //getBackTransactions()
            console.log("UserOp receipt", userOpReceipt)
            console.log("Transaction receipt", userOpReceipt.receipt)
            //toLocal(transactionHash!)
        }
    }
    return { poolWithdraw }
}