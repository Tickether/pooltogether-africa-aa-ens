"use server"

export async function getTransactionsAction (address: string) {
    if (address) {
        try {
            const res = await fetch(`${process.env.BASE_URL}/api/getTransactions`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "x-api-key": `${process.env.SUSU_API_KEY}`
                },
                body: JSON.stringify({
                    address,
                })
            })
            const data = await res.json()
            return data

        } catch(err){
            console.log(err)
        }
    }
}