'use server'

export const postPoolerAction = async (
        address: string, 
        email: string,  
        ens: string,  
    ) => {
        try {
            const res = await fetch(`${process.env.BASE_URL}/api/postPooler`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'x-api-key': `${process.env.SUSU_API_KEY}`
                },
                body: JSON.stringify({
                    address,
                    email,
                    ens, 
                })
            }) 
            const data =  await res.json()
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }