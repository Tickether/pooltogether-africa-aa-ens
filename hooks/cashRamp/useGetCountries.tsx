'use client'

import { useState, useEffect } from 'react'

export interface Countries {
    code: string
    name: string 
}

export const useGetCountries = (url: string, action: string) => {
    const [countries, setCountries] = useState<Countries[] | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<any | null>(null)

    useEffect (() => {
        const getCountries = async () => {
            setLoading(true);
            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        action,
                    })
                })
                const data = await res.json()
                setCountries(data)
            } catch (err) {
                setError(err)
            }
            setLoading(false);
        }
        getCountries()
    })

    return {countries, loading, error}
}


