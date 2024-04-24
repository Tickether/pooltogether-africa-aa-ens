import { Transaction } from '@/hooks/transactions/useGetTransactions';
import { trimRef } from '@/utils/trim';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Transaction>[] = [
    {
        accessorKey: 'status',
        header: 'Status'
    },
    {
        accessorKey: 'ref',
        header: 'Off-chain',
        cell: ({row}) => {
            const refHash = (row.getValue('ref'))
            return <div>{trimRef(refHash as string)}</div>
        },
    },
    {
        accessorKey: 'txn',
        header: 'On-chain',
        cell: ({row}) => {
            const txnHash = (row.getValue('txn'))
            return <div>{trimRef(txnHash as string)}</div>
        },
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