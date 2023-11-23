import { useGet } from '@/hooks/useGet'

interface ProfileProps {
    smartAccountAddress: string
}

export default function Profile({smartAccountAddress} : ProfileProps) {

    const {data, loading, getBack} = useGet('api/getPooler', smartAccountAddress)

    const handleUpdateProfile = async () => {
        try {
            const res = await fetch('api/updatePooler' ,{
                headers: {
                    'Content-type': 'application/json'
                },
                method: 'post',
                body: JSON.stringify({
                    smartAccountAddress,
                })
            })
        } catch (error) {
            
        }
    }

    //update
    return(
        <>
            <main>
                
            </main>
        </>
    )
}