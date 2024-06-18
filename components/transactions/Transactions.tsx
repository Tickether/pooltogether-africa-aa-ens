'use client'

import { Transaction } from '@/hooks/transactions/useGetTransactions'
import { DataTable } from './DataTable'
import { columns } from './Columns'



interface TransactionsProps {
    transactions: Transaction[]
}

export function Transactions ({ transactions } : TransactionsProps) {
    
    console.log( transactions )
    return (
        <>
            <div className='py-3 z-10 w-[26rem]'>
                {
                    transactions?.length! >= 1 && (
                        
                        <DataTable columns={columns} data={transactions!} />
                        
                    )
                }
            </div>
        </>
    )
}