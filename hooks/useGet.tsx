import axios from "axios"
import { useState, useEffect } from "react"

export const useGet = (url: string, address: string) => {
    const [data, setData] = useState<any | null>()
    const [loading, setLoading] = useState<boolean | null>(null)
    const [error, setError] = useState<any | null>(null)

    useEffect (() =>{
        const fetchData = async ()=>{
            setLoading(true)
            try {
                const res = await axios.post(url ,{
                    headers: {
                        'Content-type': 'application/json'
                    },
                    method: 'post',
                    data: {
                        address: address,
                    }
                })
                setData(res.data)
            } catch(err){
                setError(err)
            }
            setLoading(false)
        }
        fetchData()
    },[url])

    const getBack = async ()=>{
        setLoading(true);
        try {
            const res = await axios.post(url ,{
                headers: {
                    'Content-type': 'application/json'
                },
                method: 'post',
                data: {
                    address: address,
                }
            })
            setData(res.data)
        } catch(err){
            setError(err)
        }
        setLoading(false)
    }

    return {data, loading, error, getBack}
}