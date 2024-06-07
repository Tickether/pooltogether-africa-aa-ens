import { useState, useEffect } from 'react'


import { ColumnDef } from '@tanstack/react-table'

export interface Transaction {
    address: string
    target: string
    txn: string
    amount: string
    txOf: string
    
}
export const useGetTransactions = (url: string, address: string) => {
    const [transactions, setTransactions] = useState<Transaction[] | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<any | null>(null)

    useEffect (() =>{
        const getTransactions = async ()=>{
            if (address) {
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
                    setTransactions(data)
                } catch(err){
                    setError(err)
                }
                setLoading(false)
            }
        }
        getTransactions()
    },[ address ])

    useEffect(() => {
        const interval = setInterval(async () => {
            await getBackTransactions()
        }, 3000)

        return () => clearInterval(interval)
    }, [address])

    const getBackTransactions = async ()=>{
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
            setTransactions(data)
        } catch(err){
            setError(err)
        }
        setLoading(false)
    }

    return {transactions, loading, error}
}