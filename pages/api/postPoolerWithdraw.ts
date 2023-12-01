// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectDB from '@/utils/db/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import Withdraw from '@/model/withdraw'
import Pooler from '@/model/pooler'


export default async function PostPoolerWithdraw(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { address, txn, ref, prizeAmount, localAmount, currency, rate } = req.body
    try {
        await connectDB()
          
        const withdraw = await Withdraw.create({ 
            address: address,
            txn: txn,
            ref: ref,
            prizeAmount: prizeAmount, 
            localAmount: localAmount, 
            currency: currency,  
            rate: rate
        })
        await Pooler.findOneAndUpdate(
            { address: address }, 
            { $push: { withdrawals: txn } },
            { new: true }
        )  
        return res.json(withdraw)
    } catch (error) {
        return res.json(error)
    }
}