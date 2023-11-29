import { Pooler } from '@/hooks/useGetPooler'
import styles from '@/styles/Transactions.module.css'

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
                        close
                    </div>
                    <div >
                    </div>
                </div>
                
                
            </main>
        </>
    )
}