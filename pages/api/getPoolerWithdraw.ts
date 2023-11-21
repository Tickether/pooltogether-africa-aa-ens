// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectDB from '@/utils/db/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import Pooler from '@/model/pooler'
import Withdraw from '@/model/withdraw'


export default async function GetPoolerWithdraw(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { address } = req.body
    
    try {
        await connectDB()
        const pooler = await Pooler.findOne({ address: address })
        const poolerWithdraws = await Promise.all(
            pooler.withdraws.map((withdraw: string) =>{
                return Withdraw.findById(withdraw)
            })
        )
        return res.json(poolerWithdraws)
    } catch (error) {
        return res.json(error)
    }
}