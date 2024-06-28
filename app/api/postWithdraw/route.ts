// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Withdraw from '@/model/withdraw'
import connectDB from '@/utils/db/mongodb'
import { middleware } from '@/utils/middleware';



export  async function POST(
    req: Request,
) {
    const authResponse = middleware(req);
    if (authResponse.status !== 200) {
        return authResponse;
    }
    const { address, target, txn, amount, txOf } = await req.json()
    try {
        await connectDB()
        const withdraw = await Withdraw.create({ 
            address: address, 
            target: target, 
            txn: txn, 
            amount: amount,  
            txOf: txOf
        })
        return new Response(JSON.stringify(withdraw))
    } catch (error) {
        return new Response(JSON.stringify(error))
    }
}
