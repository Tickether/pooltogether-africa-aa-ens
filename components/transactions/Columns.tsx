import { Transaction } from '@/hooks/transactions/useGetTransactions';
import { trimRef } from '@/utils/trim';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Transaction>[] = [
    {
        accessorKey: 'txOf',
        header: 'Type'
    },
    {
        accessorKey: 'txn',
        header: 'Txn Hsh',
        cell: ({row}) => {
            const txnHash = (row.getValue('txn'))
            return <div>{trimRef(txnHash as string)}</div>
        },
    },
    {
        accessorKey: 'amount',
        header: 'USD',
        cell: ({row}) => {
            const amount = parseFloat(row.getValue('amount'))
            const formatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(amount)
            
            return <div>{formatted}</div>
        }
    }
]