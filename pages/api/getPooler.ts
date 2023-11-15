// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectDB from '@/utils/db/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import Pooler from '@/model/pooler'


export default async function GetPooler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { address } = req.body
    try {
        await connectDB()
        const pooler = await Pooler.findOne({ address: address })
        return res.json(pooler)
    } catch (error) {
        return res.json(error)
    }
}