'use client'

import { Transaction, useGetTransactions } from "@/hooks/transactions/useGetTransactions"
import { DataTable } from "./DataTable"
import { columns } from "./Columns"



interface TransactionsProps {
    transactions: Transaction[]
}

export function Transactions ({ transactions } : TransactionsProps) {
    
    console.log( transactions )
    return (
        <>
            <div>
                {
                    transactions?.length! >= 1 && (
                        <DataTable columns={columns} data={transactions!} />
                    )
                }
            </div>
        </>
    )
}