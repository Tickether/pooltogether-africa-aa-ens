import { useState, useEffect } from 'react'
import { susuPoolABI } from '../utils/abis/susuPoolABI'
import { BaseError, ContractFunctionRevertedError } from 'viem';
import { account, client, publicClient } from '../utils/viem/client'

export const useDripSusuPool = async() => {
    const [txnHash, setTxnHash] = useState<`0x${string}` | null>(null)
    //const [loading, setLoading] = useState<boolean | null>(null)
    const [error, setError] = useState<string | null>(null)
    

    const dripSusuPool = async(to: `0x${string}`, amount: string) => {
        try {
            const { request } = await publicClient.simulateContract({
                address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
                abi: susuPoolABI,
                functionName: 'dripSusuPool',
                args: [(to), (BigInt(amount))],
                account
            })
            const hash = await client.writeContract(request)
            setTxnHash(hash!)
            const transaction = await publicClient.waitForTransactionReceipt( 
                { hash: hash }
            )
            if (transaction.status == 'success') {
                return true
            } else {
                return false
            }  
        } catch (err) {
            if (err instanceof BaseError) {
                const revertError = err.walk(err => err instanceof ContractFunctionRevertedError)
                if (revertError instanceof ContractFunctionRevertedError) {
                    const errorName = revertError.data?.errorName ?? ''
                    // do something with `errorName`
                    setError(errorName)
                }
            }
        }
    }

    return {txnHash, error, dripSusuPool}
}