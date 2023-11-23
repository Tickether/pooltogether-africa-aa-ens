// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectDB from '@/utils/db/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import Pooler from '@/model/pooler'


export default async function PostPooler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    console.log('is doing..')
    const { address, email } = req.body
    console.log(address, email)
    try {
        await connectDB()
        const pooler = await Pooler.create({ 
            address: address,
            email: email, 
        })
        return res.json(pooler)
    } catch (error) {
        return res.json(error)
    }
}