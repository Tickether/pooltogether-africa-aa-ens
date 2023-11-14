// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectDB from '@/utils/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import Deposit from '@/model/deposit'
import Pooler from '@/model/pooler'


export default async function PostPoolerDeposit(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { address, txn, email, ens, status, prizeAmount, localAmount, currency, rate } = req.body
    try {
        await connectDB()
          
        const deposit = await Deposit.create({ 
            address: address,
            txn: txn,
            email: email, 
            ens: ens, 
            status: status, 
            prizeAmount: prizeAmount, 
            localAmount: localAmount, 
            currency: currency,  
            rate: rate
        })
        await Pooler.findOneAndUpdate(
            { address: address }, 
            { deposits: [deposit._id] }, 
            { new: true }
        )  
        return res.json(deposit)
    } catch (error) {
        return res.json(error)
    }
}
