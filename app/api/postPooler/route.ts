// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectDB from '@/utils/db/mongodb'
import Pooler from '@/model/pooler'


export async function POST(
    req: Request,
) {
    const { address, email, first, last, ens, country, phone } =  await req.json()
    try {
        await connectDB()
        const pooler = await Pooler.create({ 
            address: address,
            email: email, 
            first: first, 
            last: last, 
            ens: ens, 
            country: country, 
            phone: phone,
        })
        console.log(pooler)
        return new Response(JSON.stringify(pooler))
    } catch (error) {
        return new Response(JSON.stringify(error))
    }
}