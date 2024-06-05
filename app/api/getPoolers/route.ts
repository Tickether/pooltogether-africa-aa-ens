// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectDB from '@/utils/db/mongodb'
import Pooler from '@/model/pooler'


export async function POST(
    req: Request,
) {
    try {
        await connectDB()
        const poolers = await Pooler.find()
        // Extract addresses from the result
        const addresses = poolers.map(pooler => pooler.address);
        return new Response(JSON.stringify(addresses))
    } catch (error) {
        return new Response(JSON.stringify(error))
    }
}