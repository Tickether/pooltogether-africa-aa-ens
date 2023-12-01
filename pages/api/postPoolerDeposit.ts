// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectDB from '@/utils/db/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import Deposit from '@/model/deposit'
import Pooler from '@/model/pooler'


export default async function PostPoolerDeposit(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { address, txn, ref, prizeAmount, localAmount, currency, rate } = req.body

    try {
        await connectDB()
          
        const deposit = await Deposit.create({ 
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
            { $push: { deposits: txn } }, 
            { new: true }
        )  
        return res.json(deposit)
    } catch (error) {
        return res.json(error)
    }
}
