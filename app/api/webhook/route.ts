// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { usePoolDeposit } from '@/hooks/deposit/usePoolDeposit'


export async function POST(
    req: Request,
) {
    const {  poolDeposit } = usePoolDeposit()
    const CASHRAMP_WEBHOOK_TOKEN = process.env.CASHRAMP_WEBHOOK_TOKEN

    try {
        const payload = await req.text()
        const CASHRAMP_HEADER_TOKEN = req.headers.get('X-CASHRAMP-TOKEN')
        console.log(payload)
        console.log(CASHRAMP_HEADER_TOKEN)

        // Process the webhook payload *** if webhook token match
        if (CASHRAMP_WEBHOOK_TOKEN === CASHRAMP_HEADER_TOKEN) {
            // success deposit & update dp
            //poolDeposit()
        }
        
    } catch (error) {
        return new Response(`Webhook error: ${error}`, {
          status: 400,
        })
    }
     
    return new Response('Success!', {
        status: 200,
    })
    
}