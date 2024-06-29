import { getPoolerAction } from '@/app/actions/pooler/getPoolerAction'
import { useState, useEffect } from 'react'

export interface Pooler {
    address: string
    email: string
    ens: string 
}
export const useGetPooler = (address: string) => {
    const [pooler, setPooler] = useState<Pooler | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<any | null>(null)

    useEffect (() =>{
        const getPooler = async ()=>{
            if (address) {
                setLoading(true);
                try {
                    
                    const data = await getPoolerAction(address)
                    setPooler(data)
                } catch(err){
                    setError(err)
                }
                setLoading(false)
            }
        }
        getPooler()
    },[ address ])

    const getBackPooler = async ()=>{
        setLoading(true);
        try {
            const data = await getPoolerAction(address)
            setPooler(data)
        } catch(err){
            setError(err)
        }
        setLoading(false)
    }

    return {pooler, loading, error, getBackPooler}
}