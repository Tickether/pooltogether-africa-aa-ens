// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectDB from '@/utils/db/mongodb'
import Deposit from '@/model/deposit'


export  async function POST(
    req: Request,
) {
    const { address, txn, ref, prizeAmount, localAmount, currency, rate , status} = await req.json()

    try {
        await connectDB()
        const deposit = await Deposit.create({ 
            address: address, 
            txn: txn,
            ref: ref,
            prizeAmount: prizeAmount, 
            localAmount: localAmount, 
            currency: currency,  
            rate: rate,
            status: status
        })
        return new Response(JSON.stringify(deposit))
    } catch (error) {
        return new Response(JSON.stringify(error))
    }
}
