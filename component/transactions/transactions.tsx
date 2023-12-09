import { Pooler } from '@/hooks/useGetPooler'
import styles from './Transactions.module.css'
import Image from 'next/image'

interface TransactionsProfileProps {
    pooler: Pooler
    setOpenTransactionsModal: (openDepositModal : boolean) => void
}
export default function Transactions({pooler, setOpenTransactionsModal} : TransactionsProfileProps) {
    return(
        <>
            <main className={styles.main}>
                <div className={styles.wrapper}>
                    <div onClick={() => setOpenTransactionsModal(false)} className={styles.close}>
                        <Image 
                            src='close.svg' 
                            alt='' 
                            width={36}
                            height={36}
                        />
                    </div>
                    <div >
                    </div>
                </div>
                
                
            </main>
        </>
    )
}