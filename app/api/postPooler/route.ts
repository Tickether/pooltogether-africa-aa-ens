// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectDB from '@/utils/db/mongodb'
import Pooler from '@/model/pooler'


export async function POST(
    req: Request,
) {
    const { address, email, first, last, phone, ens, country } =  await req.json()
    try {
        await connectDB()
        const pooler = await Pooler.create({ 
            address: address,
            email: email, 
            first: first, 
            last: last, 
            phone: phone, 
            ens: ens, 
            country: country, 
        })
        return new Response(JSON.stringify(pooler))
    } catch (error) {
        return new Response(JSON.stringify(error))
    }
}