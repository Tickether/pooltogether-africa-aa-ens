import styles from '@/styles/Withdraw.module.css'


interface WithdrawProfileProps {
    setOpenWithdrawModal: (openDepositModal : boolean) => void
}
export default function Withdraw({setOpenWithdrawModal} : WithdrawProfileProps) {
    return(
        <>
            <main className={styles.main}>
            <div className={styles.wrapper}>
                <div onClick={() => setOpenWithdrawModal(false)} className={styles.close}>
                    close
                </div>
                <div >
                </div>
            </div>
                
                
            </main>
        </>
    )
}