'use client'

import { useState, useEffect } from 'react'

export interface Countries {
    code: string
    name: string 
}

export const useGetCountries = () => {
    const [countries, setCountries] = useState<Countries[] | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<any | null>(null)

    const getCountries = async () => {
        setLoading(true);
        try {
            const res = await fetch('api/getCountries', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'availableCountries',
                })
            })
            const data = await res.json()
            setCountries(data)
        } catch (err) {
            setError(err)
        }
        setLoading(false);
    }

    return {countries, loading, error, getCountries}
}


