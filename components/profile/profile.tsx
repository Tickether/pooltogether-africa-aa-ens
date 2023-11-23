import { useGet } from '@/hooks/useGet'
import styles from '@/styles/Profile.module.css'
interface ProfileProps {
    smartAccountAddress: string
    setOpenProfiletModal: (openDepositModal : boolean) => void
}

export default function Profile({smartAccountAddress, setOpenProfiletModal} : ProfileProps) {

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
            <main className={styles.main}>
                <div className={styles.wrapper}>
                    <div onClick={() => setOpenProfiletModal(false)} className={styles.close}>
                        close
                    </div>
                    <div >

                    </div>
                </div>
            </main>
        </>
    )
}