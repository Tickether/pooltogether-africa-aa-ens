// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Withdraw from '@/model/withdraw'
import connectDB from '@/utils/db/mongodb'



export  async function POST(
    req: Request,
) {
    const { address, txn, ref, prizeAmount, localAmount, currency, rate, status } = await req.json()

    try {
        await connectDB()
        const withdraw = await Withdraw.create({ 
            address: address, 
            txn: txn,
            ref: ref,
            prizeAmount: prizeAmount, 
            localAmount: localAmount, 
            currency: currency,  
            rate: rate,
            status: status
        })
        return new Response(JSON.stringify(withdraw))
    } catch (error) {
        return new Response(JSON.stringify(error))
    }
}
