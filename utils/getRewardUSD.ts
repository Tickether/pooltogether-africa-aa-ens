import axios from 'axios'

export const getRewardUSD = async (amount: string) => {
    try {
        const options = {
            method: 'GET',
            headers: {'X-API-KEY': process.env.NEXT_PUBLIC_COINGECKO_API}
        };
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`
        const tokenUSD = await axios.get(url, options)
        console.log(tokenUSD.data)
        const rateInUSD: number = tokenUSD.data['ethereum'].usd 
        console.log(rateInUSD)
        const valueInUSD = (rateInUSD) * parseFloat(amount) 
        return (valueInUSD.toFixed(2))
    } catch (error) {
        console.log(error)
    }
    
}