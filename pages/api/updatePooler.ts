// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectDB from '@/utils/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import Pooler from '@/model/pooler'

export default async function UpdatePooler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { address, email, ens } = req.body
    try {
        await connectDB()
        const pooler = await Pooler.findOneAndUpdate(
            { address: address }, 
            { email: email, ens: ens }, 
            { new: true }
        )        
        return res.json(pooler)
    } catch (error) {
        return res.json(error)
    }
}