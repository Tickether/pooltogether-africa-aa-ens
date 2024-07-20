"use server"

type ConfirmEscrowResponse = {
    confirmTransaction: boolean;
};

export async function postCashrampEscrowAction( paymentRequest: string, transactionHash: string ) {
    try {
        const query = `
            mutation {
                confirmTransaction(
                    paymentRequest: "${paymentRequest}",
                    transactionHash: "${transactionHash}",
                ) 
            }
        `;

        const resposne = await fetch(`https://api.useaccrue.com/cashramp/api/graphql`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${process.env.CASHRAMP_API_SECRET_KEY}`
            },
            
            body: JSON.stringify({
                query
            })
        }) 
        const result =  await resposne.json()
        console.log(result.data)
        return result.data as ConfirmEscrowResponse
    } catch (error) {
        console.log(error)
    }
}