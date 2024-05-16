'use client'

import { useState, useEffect } from 'react'

/*
export interface Payment {
    depositRate: string
    withdrawalRate: string 
}
*/

export const useGetPayment = () => {
    const [payment, setPayment] = useState<any | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<any | null>(null)

    const getPayment = async ( ref: string ) => {
        setLoading(true);
        try {
            const res = await fetch('api/getPayment', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    ref,
                })
            })
            const data = await res.json()
            console.log(data)
            setPayment(data)
        } catch (err) {
            setError(err)
        }
        setLoading(false);
    }

    return {payment, loading, error, getPayment}
}


