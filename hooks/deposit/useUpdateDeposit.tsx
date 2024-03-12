'use client'

import { toast } from '@/components/ui/use-toast';
import { useState } from 'react'

export const useUpdateDeposit = () => {

    const [loading, setLoading] = useState<boolean | null>(null)

    async function giveMeSuccessToast(): Promise<void> {
        return new Promise((resolve) => {
            toast({
                title: 'Your Deposit is Successful!',
                description: 'You can confirm by checking your balance & history!!',
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
                title: 'Withdraw Failed, Try again!',
                description: 'Something went wrong, try again, check faqs, or contact support!!',
                variant: 'destructive'
            });
    
            // Set a timeout of six seconds (6000 milliseconds)
            setTimeout(() => {
                resolve();
            }, 3666);
        });
    }

    const updateDeposit = async ( 
        ref: string, 
        txn: string, 
        status: string, 
    ) => {
        setLoading(true)
        try {
            const res = await fetch('api/updateDeposit', {
                method: 'POST',
                headers: {
                'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    ref,
                    txn,
                    status
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

    return {loading, updateDeposit}
}