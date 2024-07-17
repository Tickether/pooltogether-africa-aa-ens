"use server"

export const getPoolerAction = async (address: string)=>{
    if (address) {
        try {
            const res = await fetch(`${process.env.BASE_URL}/api/getPooler`, {
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