// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'

const api = axios.create({
    baseURL: 'https://api.useaccrue.com/cashramp/api/graphql',
    headers: { 'Authorization': `Bearer ${process.env.CASHRAMP_API_SECRET_KEY}` } 
});
export async function POST(
    req: Request,
) {
    const { action, country } = await req.json()
    const query = `
        query {
            marketRate(countryCode: "${country}") {
                depositRate
                withdrawalRate
            }
        }
    `;
    
    try {
        const rates = await api.post('', { query })
        return new Response(JSON.stringify(rates.data.data[action]))
    } catch (error) {
        return new Response(JSON.stringify(error))
    }
}