// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectDB from '@/utils/db/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import Pooler from '@/model/pooler'
import Deposit from '@/model/deposit'

export default async function GetPoolerDeposits(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { address } = req.body

    try {
        await connectDB()
        const pooler = await Pooler.findOne({ address: address })
        const poolerDeposits = await Promise.all(
            pooler.deposits.map((deposit: string) =>{
                return Deposit.findById(deposit);
            })
        );
        return res.json(poolerDeposits)
    } catch (error) {
        return res.json(error)
    }
}