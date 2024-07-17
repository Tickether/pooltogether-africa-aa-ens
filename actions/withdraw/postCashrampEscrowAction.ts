"use server"

type ConfirmEscrowResponse = {
    confirmTransaction: boolean;
};

export async function postCashrampEscrowAction( paymentRequest: string, transactionHash: string ) {
    try {
        const res = await fetch(`${process.env.BASE_URL}/api/postCashrampEscrow`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                paymentRequest,
                transactionHash,
            })
        }) 
        const data =  await res.json()
        console.log(data)
        return data //as ConfirmEscrowResponse
    } catch (error) {
        console.log(error)
    }
}