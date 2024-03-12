// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Deposit from '@/model/deposit'
import connectDB from '@/utils/db/mongodb'



export  async function POST(
    req: Request,
) {
    const { txn, ref, status } = await req.json()

    try {
        await connectDB()
        const deposit = await Deposit.findOneAndUpdate(
            { ref: ref }, 
            { 
                txn: txn,
                status: status
            }, 
            { new: true }
        )
        return new Response(JSON.stringify(deposit))
    } catch (error) {
        return new Response(JSON.stringify(error))
    }
}
