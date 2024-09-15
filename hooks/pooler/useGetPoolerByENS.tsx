
import { getPoolerByENSAction } from "@/actions/pooler/getPoolerByENSAction"
import { useState, useEffect } from "react"
import { Pooler } from "./useGetPooler"


export const useGetPoolerByENS = (ens: string) => {
    const [poolerByENS, setPoolerByENS] = useState<Pooler | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<any | null>(null)



    useEffect (() =>{
        const getPoolerByENS = async ()=>{
            if (ens) {
                setLoading(true);
                try {
                    
                    const data = await getPoolerByENSAction(ens)
                    setPoolerByENS(data)
                } catch(err){
                    setError(err)
                }
                setLoading(false)
            }
        }
        getPoolerByENS()
    },[ ens ])


    return {poolerByENS, loading, error}
}