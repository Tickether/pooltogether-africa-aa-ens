'use client'

import { toast } from '@/components/ui/use-toast';
import { useState } from 'react'

export const usePostDeposit = () => {

    const [loading, setLoading] = useState<boolean>(false)

    async function giveMeSuccessToast(): Promise<void> {
        return new Promise((resolve) => {
            toast({
                title: 'Your Depsoit is Successful',
                description: 'Your can earn rewards for saving!!',
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
                description: 'Something went wrong, try again, or contact support!!',
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
        target: string, 
        txn: string, 
        amount: string,  
        txOf: string
    ) => {
        try {
            setLoading(true)
            const res = await fetch('api/postDeposit', {
                method: 'POST',
                headers: {
                'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    address,
                    target, 
                    txn, 
                    amount, 
                    txOf 
                })
            }) 
            const data =  await res.json()
            console.log(data)
            giveMeSuccessToast()
            setLoading(false)
        } catch (error) {
            console.log(error)
            giveMeFailedToast()
            setLoading(false)
        }
        
    }

    return {loading, postDeposit}
}