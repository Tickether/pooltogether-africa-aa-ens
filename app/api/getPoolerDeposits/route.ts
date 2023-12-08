// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectDB from '@/utils/db/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import Pooler from '@/model/pooler'
import Deposit from '@/model/deposit'

export default async function GetPoolerDeposits(
    req: Request,
) {
    const { address } = await req.json()

    try {
        await connectDB()
        const pooler = await Pooler.findOne({ address: address })
        const poolerDeposits = await Promise.all(
            pooler.deposits.map((deposit: string) =>{
                return Deposit.findById(deposit)
            })
        )
        return new Response(JSON.stringify(poolerDeposits))
    } catch (error) {
        return new Response(JSON.stringify(error))
    }
}