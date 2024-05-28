// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectDB from '@/utils/db/mongodb'
import Incentive from '@/model/incentive'


export  async function POST(
    req: Request,
) {
    const { address, target, txn, amount, txOf } = await req.json()

    try {
        await connectDB()
        const incentive = await Incentive.create({ 
            address: address, 
            target: target, 
            txn: txn, 
            amount: amount,  
            txOf: txOf
        })
        return new Response(JSON.stringify(incentive))
    } catch (error) {
        return new Response(JSON.stringify(error))
    }
}
