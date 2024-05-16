'use client'

import { toast } from '@/components/ui/use-toast';
import { useState } from 'react'

export const usePostDeposit = () => {

    const [loading, setLoading] = useState<boolean | null>(null)

    async function giveMeSuccessToast(): Promise<void> {
        return new Promise((resolve) => {
            toast({
                title: 'Your Payment is Successful..',
                description: 'Your USD will arive shortly',
            });
            // Set a timeout of six seconds (6000 milliseconds)
            setTimeout(() => {
                resolve();
            }, 3666);
        });
    }
    async function giveMeFailedToast(): Promise<void> {
        return new Promise((resolve) => {
            toast({
                title: 'Deposit Failed, Try again!',
                description: 'Something went wrong, try again, check faqs, or contact support!!',
                variant: 'destructive'
            });
    
            // Set a timeout of six seconds (6000 milliseconds)
            setTimeout(() => {
                resolve();
            }, 3666);
        });
    }

    const postDeposit = async (
        address: string, 
        txn: string, 
        ref: string, 
        prizeAmount: string, 
        localAmount: string, 
        currency: string, 
        rate: string, 
        status: string, 
        service: string,
        fee: string
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
                    status,
                    service,
                    fee
                })
            }) 
            const data =  await res.json()
            console.log(data)
            giveMeSuccessToast()
        } catch (error) {
            console.log(error)
            giveMeFailedToast()
        }
        setLoading(false)
    }

    return {loading, postDeposit}
}