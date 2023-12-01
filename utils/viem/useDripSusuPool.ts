
import { susuPoolABI } from '../abis/susuPoolABI'
import { BaseError, ContractFunctionRevertedError, encodeFunctionData } from 'viem';
import { client, publicClient } from './client'

export const dripSusuPool = async(to: `0x${string}`, amount: bigint) => {
    try {
        const data = encodeFunctionData({
            abi: susuPoolABI,
            functionName: 'dripSusuPool',
            args: [ (to), (amount)]
        })
        const hash = await client.sendTransaction({
            data: data,
            to: '0x9d7C4Ea7B93699EC0FE1b28776082E297A015734',
            value: BigInt(0)
        })
        console.log(hash!)
        const transaction = await publicClient.waitForTransactionReceipt( 
            { hash: hash }
        )
        console.log(transaction.status)
        return hash!
    } catch (err) {
        if (err instanceof BaseError) {
            const revertError = err.walk(err => err instanceof ContractFunctionRevertedError)
            if (revertError instanceof ContractFunctionRevertedError) {
                const errorName = revertError.data?.errorName ?? ''
                // do something with `errorName`
                console.log(errorName)
            }
        }
    }
}