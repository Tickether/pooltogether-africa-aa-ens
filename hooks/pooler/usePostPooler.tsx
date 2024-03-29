'use client'

import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react'

export const usePostPooler = () => {
    
    const router = useRouter()
    const [loading, setLoading] = useState<boolean | null>(null)

    async function giveMeSuccessToast(): Promise<void> {
        return new Promise((resolve) => {
            toast({
                title: 'Profile Setup Successful!',
                description: 'You can now make deposit & withdrawals!!',
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
                title: 'Profile Setup Failed, Try again!',
                description: 'Something went wrong, try again, check FAQs, or contact support!!',
                variant: 'destructive'
            });
            // Set a timeout of six seconds (6000 milliseconds)
            setTimeout(() => {
                resolve();
            }, 3666);
        });
    }

    const postPooler = async (
        address: string, 
        email: string, 
        first: string, 
        last: string, 
        ens: string,
        country: string,
        phone: string, 
        
    ) => {
        setLoading(true)
        try {
            const res = await fetch('api/postPooler', {
                method: 'POST',
                headers: {
                'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    address,
                    email,
                    first, 
                    last, 
                    ens, 
                    country, 
                    phone, 
                })
            }) 
            const data =  await res.json()
            console.log(data)
            await giveMeSuccessToast()
        } catch (error) {
            console.log(error)
            giveMeFailedToast()
        }
        setLoading(false)
    }

    return {loading, postPooler}
}