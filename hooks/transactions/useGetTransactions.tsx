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
                    setTransactions((prevTransactions) => {
                        if (!prevTransactions) {
                            return data;
                        } else {
                            if (prevTransactions.length !== data.length) {
                                return data;
                            } else {
                                return prevTransactions;
                            }
                        }
                    });
                } catch(err){
                    setError(err)
                }
                setLoading(false)
            }
        }
        getTransactions()

        const intervalId = setInterval(getTransactions, 3000)

        return () => clearInterval(intervalId)
    },[ address ])

    return {transactions, loading, error}
}