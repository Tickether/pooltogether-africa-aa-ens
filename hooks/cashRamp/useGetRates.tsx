'use client'

import { useState, useEffect } from 'react'

export interface Rate {
    depositRate: string
    withdrawalRate: string 
}

export const useGetRates = (url: string, action: string, country: string) => {
    const [rates, setRates] = useState<Rate | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<any | null>(null)

    useEffect (() => {
        const getRates = async () => {
            setLoading(true);
            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        action,
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
        getRates()
    })

    return {rates, loading, error}
}


