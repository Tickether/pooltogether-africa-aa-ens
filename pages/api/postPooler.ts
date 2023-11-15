// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectDB from '@/utils/db/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import Pooler from '@/model/pooler'


export default async function PostPooler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { address, email, ens } = req.body
    try {
        await connectDB()
        const pooler = await Pooler.create({ 
            address: address,
            email: email, 
            ens: ens, 
        })
        return res.json(pooler)
    } catch (error) {
        return res.json(error)
    }
}