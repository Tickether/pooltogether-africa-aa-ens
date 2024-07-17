"use server"

export const postDepositAction = async (
    address: string, 
    target: string, 
    txn: string, 
    amount: string,  
    txOf: string
) => {
    try {
        const res = await fetch(`${process.env.BASE_URL}/api/postDeposit`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "x-api-key": `${process.env.SUSU_API_KEY}`
            },
            body: JSON.stringify({
                address,
                target, 
                txn, 
                amount, 
                txOf 
            })
        }) 
        const data =  await res.json()
        console.log(data)
    } catch (error) {
        console.log(error)
    }
    
}