// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectDB from '@/utils/db/mongodb'
import Deposit from '@/model/deposit'
import Withdraw from '@/model/withdraw'


export async function POST(
    req: Request,
) {
    const { address } = await req.json()
    try {
        await connectDB()
        const deposits = await Deposit.find({ address: address })
        const withdrawals = await Withdraw.find({ address })

        // Combine deposits and withdrawals into a single array
        const transactions = [...deposits, ...withdrawals]

        // Sort the combined array by date in descending order
        const sortedTransactions = transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

        return new Response(JSON.stringify(sortedTransactions));
    } catch (error) {
        return new Response(JSON.stringify(error))
    }
}