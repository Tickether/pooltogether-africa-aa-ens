// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectDB from '@/utils/db/mongodb'
import Deposit from '@/model/deposit'


export  async function POST(
    req: Request,
) {
    const { address, target, txn, amount, txOf } = await req.json()

    try {
        await connectDB()
        const deposit = await Deposit.create({ 
            address: address, 
            target: target, 
            txn: txn, 
            amount: amount,  
            txOf: txOf
        })
        return new Response(JSON.stringify(deposit))
    } catch (error) {
        return new Response(JSON.stringify(error))
    }
}
