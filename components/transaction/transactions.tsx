"use client"

import { Transaction } from "@/hooks/transactions/useGetTransactions"
import { DataTable } from "./dataTable"
import { Columns } from "./columns"
import { SocialShare } from "./socialShare"



interface TransactionsProps {
    transactions: Transaction[]
}

export function Transactions ({ transactions } : TransactionsProps) {
    
    console.log( transactions )
    return (
        <>
            <div className="py-3 z-10 w-[26rem]">
                {
                    transactions?.length! >= 1 && (
                        <div className="flex flex-col gap-3">
                            <SocialShare/>
                            <DataTable columns={Columns} data={transactions!} />
                        </div>
                        
                    )
                }
            </div>
        </>
    )
}