import { Transaction } from '@/hooks/transactions/useGetTransactions';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Transaction>[] = [
    {
        accessorKey: 'status',
        header: 'Status'
    },
    {
        accessorKey: 'ref',
        header: 'Off-chain'
    },
    {
        accessorKey: 'txn',
        header: 'On-chain'
    },
    {
        accessorKey: 'currency',
        header: 'Currency'
    },
    {
        accessorKey: 'rate',
        header: 'Rate'
    },
    {
        accessorKey: 'localAmount',
        header: 'Local',

    },
    {
        accessorKey: 'prizeAmount',
        header: 'USD',
        cell: ({row}) => {
            const amount = parseFloat(row.getValue('prizeAmount'))
            const formatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(amount)
            
            return <div>{formatted}</div>
        }
    }
]