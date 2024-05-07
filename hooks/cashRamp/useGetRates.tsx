'use client'

import { useState, useEffect } from 'react'

export interface Rate {
    depositRate: string
    withdrawalRate: string 
}

export const useGetRates = () => {
    const [rates, setRates] = useState<Rate | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<any | null>(null)

    const getRates = async ( country: string ) => {
        setLoading(true);
        try {
            const res = await fetch('api/getRates', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'marketRate',
                    country,
                })
            })
            const data = await res.json()
            setRates(data)
        } catch (err) {
            setError(err)
        }
        setLoading(false);
    }

    return {rates, loading, error, getRates}
}


