// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'

const api = axios.create({
    baseURL: 'https://api.useaccrue.com/cashramp/api/graphql',
    headers: { 'Authorization': `Bearer ${process.env.CASHRAMP_API_SECRET_KEY}` } 
});
export async function POST(
    req: Request,
) {
    const { action, ref } = await req.json()
    const query = `
        query {
            merchantPaymentRequest(reference: "KES-1715549139115") {
                id
                paymentType
                hostedLink
                amount
                currency
                reference
                status
            }
        }
    `;
    
    try {
        const paymentReq = await api.post('', { query })
    return new Response(JSON.stringify(paymentReq.data.data))
    } catch (error) {
        return new Response(JSON.stringify(error))
    }
}