"use server"

export async function getPoolerByENSAction (ens: string) {
    if (ens) {
        try {
            const res = await fetch(`${process.env.BASE_URL}/api/getPoolerByENS`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "x-api-key": `${process.env.SUSU_API_KEY}`
                },
                body: JSON.stringify({
                    ens,
                })
            })
            const data = await res.json()
            return data
        } catch(err){
            console.log(err)
        }
    }
}