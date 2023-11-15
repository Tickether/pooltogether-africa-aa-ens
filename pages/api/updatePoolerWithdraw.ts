// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectDB from '@/utils/db/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'


export default async function UpdatePoolerWithdraw(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    try {
        await connectDB()
    } catch (error) {
        return res.json(error)
    }
}