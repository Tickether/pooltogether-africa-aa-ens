'use client'

import { useState } from 'react'

export const usePostDeposit = () => {

    const [loading, setLoading] = useState<boolean | null>(null)

    const postDeposit = async (
        address: string, 
        txn: string, 
        ref: string, 
        prizeAmount: string, 
        localAmount: string, 
        currency: string, 
        rate: string
        
    ) => {
        setLoading(true)
        try {
            const res = await fetch('api/postDeposit', {
                method: 'POST',
                headers: {
                'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    address,
                    txn,
                    ref,
                    prizeAmount, 
                    localAmount, 
                    currency,  
                    rate,
                })
            }) 
            const data =  await res.json()
        console.log(data)
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    return {loading, postDeposit}
}