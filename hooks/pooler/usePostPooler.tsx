'use client'

import { useState } from 'react'

export const usePostPooler = () => {

    const [loading, setLoading] = useState<boolean | null>(null)

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
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    return {loading, postPooler}
}