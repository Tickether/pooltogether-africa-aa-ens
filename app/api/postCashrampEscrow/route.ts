// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'

const api = axios.create({
    baseURL: 'https://api.useaccrue.com/cashramp/api/graphql',
    headers: { 'Authorization': `Bearer ${process.env.CASHRAMP_API_SECRET_KEY}` } 
});
export async function POST(
    req: Request,
) {
    const { paymentRequest, transactionHash } = await req.json()
    const query = `
        mutation {
            confirmTransaction(
                paymentRequest: "${paymentRequest}",
                transactionHash: "${transactionHash}",
            ) 
        }
    `;
    
    try {
        const confirmed = await api.post('', { query })
        return new Response(JSON.stringify(confirmed.data.data))
    } catch (error) {
        return new Response(JSON.stringify(error))
    }
}