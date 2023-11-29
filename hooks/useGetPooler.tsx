import { useState, useEffect } from 'react'

export interface Pooler {
    address: string
    email: string 
    first: string
    last: string 
    phone: string 
    ens: string
    country: string
    deposits: any[]
    withdrawals: any[]

}
export const useGet = (url: string, address: string) => {
    const [pooler, setPooler] = useState<Pooler | null>(null)
    const [loading, setLoading] = useState<boolean | null>(null)
    const [error, setError] = useState<any | null>(null)

    useEffect (() =>{
        const getPooler = async ()=>{
            setLoading(true)
            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        address,
                    })
                })
                const data = await res.json()
                setPooler(data)
            } catch(err){
                setError(err)
            }
            setLoading(false)
        }
        getPooler()
    },[ address ])

    const getBackPooler = async ()=>{
        setLoading(true);
        try {
            const res = await fetch(url ,{
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    address: address,
                })
            })
            const data = await res.json()
            setPooler(data)
        } catch(err){
            setError(err)
        }
        setLoading(false)
    }

    return {pooler, loading, error, getBackPooler}
}