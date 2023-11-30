
import { susuPoolABI } from '../abis/susuPoolABI'
import { BaseError, ContractFunctionRevertedError, encodeFunctionData } from 'viem';
import { client, publicClient } from './client'

export const dripSusuPool = async(to: `0x${string}`, amount: string) => {
    try {
        const data = encodeFunctionData({
            abi: susuPoolABI,
            functionName: 'dripSusuPool',
            args: [ (`0x${to.slice(2)}`), (BigInt(amount))]
        })
        const hash = await client.sendTransaction({
            data: data,
            to: '0x0b22b04470f9d605d571f8501687ffc5d637e9f2',
            value: BigInt(0)
        })
        console.log(hash!)
        const transaction = await publicClient.waitForTransactionReceipt( 
            { hash: hash }
        )
        console.log(transaction.status)
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

export const dripSusuPools = async(to: `0x${string}`, amount: string) => {
    try {
        const hash = await client.sendTransaction({ 
            to: '0x99342D3CE2d10C34b7d20D960EA75bd742aec468',
            value: BigInt(amount)
        })
        console.log(hash!)
        const transaction = await publicClient.waitForTransactionReceipt( 
            { hash: hash }
        )
        console.log(transaction.status)
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