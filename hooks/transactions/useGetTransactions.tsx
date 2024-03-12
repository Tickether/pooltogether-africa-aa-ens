import { useState, useEffect } from 'react'


import { ColumnDef } from '@tanstack/react-table'

export interface Transaction {
    address: string
    txn: string
    ref: string
    prizeAmount: string
    localAmount: string 
    currency: string
    rate: string, 
    status: string, 
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

    const getBackTransactions = async ()=>{
        setLoading(true);
        console.log('aaa')
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

    return {transactions, loading, error, getBackTransactions}
}