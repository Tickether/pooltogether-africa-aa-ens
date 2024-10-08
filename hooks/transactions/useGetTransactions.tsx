import { useState, useEffect } from "react"
import { useBlockNumber } from "wagmi"
import isEqual from "lodash/isEqual"
import { getTransactionsAction } from "@/actions/transactions/getTransactionsAction"

export interface Transaction {
    address: string
    target: string
    txn: string
    amount: string
    txOf: string
    createdAt: Date
    
}
export const useGetTransactions = (address: string) => {
    const { data: blockNumber } = useBlockNumber({ watch: true }) 
    const [transactions, setTransactions] = useState<Transaction[] | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<any | null>(null)

    useEffect (() =>{
        const getTransactions = async ()=>{
            if (address) {
                try {
                    
                    const data = await getTransactionsAction(address)
                    // Check if the new data is different from the current transactions
                    if (!isEqual(data, transactions)) {
                        setTransactions(data)
                    }
                } catch(err){
                    setError(err)
                }
                setLoading(false)
            }
        }
        getTransactions()
    },[ address, blockNumber ])

    return {transactions, loading, error}
}