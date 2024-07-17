"use client"

import { postDepositAction } from "@/actions/deposit/postDepositAction";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react"

export const usePostDeposit = () => {

    const [loading, setLoading] = useState<boolean>(false)

    async function giveMeSuccessToast(): Promise<void> {
        return new Promise((resolve) => {
            toast({
                title: "Your Depsoit is Successful",
                description: "Your can earn rewards for saving!!",
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
                title: "Deposit Failed, Try again!",
                description: "Something went wrong, try again, or contact support!!",
                variant: "destructive"
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
           
            const data =  await postDepositAction(
                address,
                target, 
                txn, 
                amount, 
                txOf 
            )
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