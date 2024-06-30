'use server'

interface onrampSessionsProps {
    client_secret: string
}
export async function createOnrampSession(address: string) {

    const body = new URLSearchParams({
        'wallet_addresses[base_network]': address,
        'destination_networks[]': 'base',
        'destination_currencies[]': 'usdc',
        'destination_network': 'base',
        'destination_currency': 'usdc',
        'lock_wallet_address': 'true',
    });

    try {
        const res =  await fetch('https://api.stripe.com/v1/crypto/onramp_sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(process.env.STRIPE_SECRET_KEY)
            },
            body: body.toString()
        });
        const data = await res.json()
        console.log(data)
        return data as onrampSessionsProps
    } catch (error) {
        
    }

    
}
