// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Withdraw from '@/model/withdraw'
import connectDB from '@/utils/db/mongodb'



export  async function POST(
    req: Request,
) {
    const { txn, ref, status } = await req.json()

    try {
        await connectDB()
        const withdraw = await Withdraw.findOneAndUpdate(
            { txn: txn }, 
            { 
                ref: ref,
                status: status
            }, 
            { new: true }
        )
        return new Response(JSON.stringify(withdraw))
    } catch (error) {
        return new Response(JSON.stringify(error))
    }
}
