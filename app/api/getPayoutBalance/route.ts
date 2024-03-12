/*
const https = require('https')

const options = {
  hostname: 'api.paystack.co',
  port: 443,
  path: '/balance',
  method: 'GET',
  headers: {
    Authorization: 'Bearer SECRET_KEY'
  }
}

https.request(options, res => {
  let data = ''

  res.on('data', (chunk) => {
    data += chunk
  });

  res.on('end', () => {
    console.log(JSON.parse(data))
  })
}).on('error', error => {
  console.error(error)
})

*/

export async function GET(
    req: Request,
) {
    try {
        const res = await fetch('https://api.paystack.co/balance', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'API-Key': process.env.PAYSTACK_SECRET_KEY!,
                //Authorization: process.env.PAYSTACK_SECRET_KEY!
            },
        })
        return new Response(JSON.stringify(res))
    } catch (error) {
        return new Response(JSON.stringify(error))
    }
}