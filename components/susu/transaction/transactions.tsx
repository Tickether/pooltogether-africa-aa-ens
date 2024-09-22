"use client"

import { Transaction } from "@/hooks/transactions/useGetTransactions"
import { DataTable } from "./dataTable"
import { Columns } from "./columns"
import { SocialShare } from "./socialShare"
import { Referrals } from "./referrals"
import { Pooler } from "@/hooks/pooler/useGetPooler"



interface TransactionsProps {
    transactions: Transaction[]
    pooler: Pooler
}

export function Transactions ({ transactions, pooler } : TransactionsProps) {
    
    console.log( transactions )
    return (
        <>
            <div className="py-3 z-10 w-[26rem]">
                {
                    transactions?.length! >= 1 && (
                        <div className="flex flex-col gap-3">
                           <div className="flex justify-end">
                                <div className="flex gap-3">   
                                    <Referrals pooler={pooler}/>
                                    <SocialShare pooler={pooler}/>
                                </div>
                           </div>
                            <DataTable columns={Columns} data={transactions!} />
                        </div>
                        
                    )
                }
            </div>
        </>
    )
}