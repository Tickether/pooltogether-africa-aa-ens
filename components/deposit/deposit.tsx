import { Inter } from 'next/font/google'
import styles from '@/styles/Deposit.module.css'
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3'
import { useState } from 'react'


interface DepositProps {
    smartAccountAddress : string
    setOpenDepositModal: (openDepositModal : boolean) => void
}
export default function Deposit({smartAccountAddress, setOpenDepositModal} : DepositProps) {
    const [amountLocal, setAmountLocal] = useState<string | null>(null)
    const [amountDollar, setAmountDollar] = useState<string | null>(null)
    /*
    Top 10 Countdown - ones I cant gate for except (DRC)
    Uganda
    Morocco
    Ghana
    Ethiopia
    Tanzania 
    Egypt 
    Kenya 
    South Africa
    Nigeria
    */
    const config = {
        public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_KEY,
        tx_ref: `0`,//currency x timestaamp/datestamp
        amount: Number(amountLocal!),//amount local value inout
        currency: 'EGP',//select on page defaults to selected from db
        payment_options: 'card,mobilemoney,ussd',
        customer: {
            //get from db info
            email: 'tickether@gmail.com',
            phone_number: '233531616924',
            name: 'john doe',
        },
        customizations: {
            title: 'PoolTogether Africa',
            description: 'Payment for PoolTogether Africa services',
            logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
        },
    }
    const handleFlutterPayment = useFlutterwave(config)
    const doLocalPay = () => {
        handleFlutterPayment({
            callback: (response) => {
                console.log(response)
                closePaymentModal() // this will close the modal programmatically
            },
            onClose: () => {},
        })
    }
    const handleLocalChange = (e: any) => {
        // Allow only numbers and a maximum of two decimal places
        const regex = /^\d*\.?\d{0,2}$/;
        const inputValue = e.target.value;

        if (regex.test(inputValue) || inputValue === '') {
            setAmountLocal(inputValue === '' ? '' : inputValue);
            const dollarRate = parseFloat(inputValue) / 12.20;
            setAmountDollar(inputValue === ''? '' : String(dollarRate.toFixed(2)));
        }
    }
    const handleDollarChange = (e: any) => {
        // Allow only numbers and a maximum of two decimal places
        const regex = /^\d*\.?\d{0,2}$/;
        const inputValue = e.target.value;

        if (regex.test(inputValue) || inputValue === '') {
            setAmountDollar(inputValue === '' ? '' : inputValue);
            const localRate = parseFloat(inputValue) * 12.20;
            setAmountLocal(inputValue === ''? '' : String(localRate.toFixed(2)));
        }
    }
    return(
        <>
            <main className={styles.main}>
                <div className={styles.wrapper}>
                    <div onClick={() => setOpenDepositModal(false)} className={styles.close}>
                        close
                    </div>
                    <div >
                        <div  className={styles.saving}>
                            <span>I have</span>
                            <div>
                                <label>GHS</label>
                                <input 
                                    type="text" 
                                    value={amountLocal!}
                                    onChange={handleLocalChange}
                                />
                            </div>
                        </div>
                        <div>
                            <span>I want</span>
                            <div>
                                <span>USD</span>
                                <input
                                    type="text" 
                                    value={amountDollar!}
                                    onChange={handleDollarChange}
                                />
                            </div>
                        </div>
                    </div>
                    <button onClick={doLocalPay}>Save to Susu</button>
                </div>
                
            </main>
        </>
    )
}