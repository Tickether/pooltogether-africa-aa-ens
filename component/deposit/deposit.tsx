import styles from './Deposit.module.css'
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3'
import { useState } from 'react'
import { Pooler } from '@/hooks/useGetPooler'
import { Countries, Country } from '@/utils/constants/countries'
import { dripSusuPool } from '@/utils/viem/useDripSusuPool'
import { parseUnits } from 'viem'


interface DepositProps {
    pooler: Pooler
    address : string
    setOpenDepositModal: (openDepositModal : boolean) => void
    onDepositClose: () => void
}
export default function Deposit({pooler, address, setOpenDepositModal, onDepositClose} : DepositProps) {

    const country : Country = ( Countries as any )[pooler.country]
    console.log(country)

    const [amountLocal, setAmountLocal] = useState<string | null>(null)
    const [amountDollar, setAmountDollar] = useState<string | null>(null)

    const config = {
        //public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_KEY,
        public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_TEST_KEY,
        tx_ref: `${country.code}${Date.now()}`, //currency x timestaamp/datestamp
        amount: Number(amountLocal!), //amount local value inout
        currency: country.code, //select on page defaults to selected from db
        payment_options: 'card,mobilemoney,ussd',
        customer: {
            //get from db info
            email: pooler.email,
            phone_number: pooler.phone,
            name: `${pooler.first} ${pooler.last}`,
        },
        customizations: {
            title: 'PoolTogether Africa',
            description: 'Payment for PoolTogether Africa services',
            logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
        },
    }
    const handleFlutterPayment = useFlutterwave(config)
    const doLocalPay = () => {
        if (amountLocal != null) {
            handleFlutterPayment({
                callback: (response) => {
                    console.log(response)
                    if (response.status == 'successful') {
                        //amount Dollars sent to smart address and offchain store
                        handleNewPoolerDeposit(response.flw_ref)
                    }
                    
                    closePaymentModal() // this will close the modal programmatically
                    setOpenDepositModal(false)
                },
                onClose: () => {
                    
                   console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
                },
            })
        }
    }
    const handleLocalChange = (e: any) => {
        // Allow only numbers and a maximum of two decimal places
        const regex = /^\d*\.?\d{0,2}$/;
        const inputValue = e.target.value;

        if (regex.test(inputValue) || inputValue === '') {
            setAmountLocal(inputValue === '' ? '' : inputValue);
            const dollarRate = parseFloat(inputValue) / parseFloat(country.$rate);
            setAmountDollar(inputValue === ''? '' : String(dollarRate.toFixed(2)));
        }
    }
    const handleDollarChange = (e: any) => {
        // Allow only numbers and a maximum of two decimal places
        const regex = /^\d*\.?\d{0,2}$/;
        const inputValue = e.target.value;

        if (regex.test(inputValue) || inputValue === '') {
            setAmountDollar(inputValue === '' ? '' : inputValue)
            const localRate = parseFloat(inputValue) * parseFloat(country.$rate)
            setAmountLocal(inputValue === ''? '' : String(localRate.toFixed(2)))
        }
    }

    const postPoolerDeposit = async (address: string, txn: string, ref: string, prizeAmount: string, localAmount: string, currency: string, rate: string) => {
        try {
            const res = await fetch('api/postPoolerDeposit  ', {
                method: 'POST',
                headers: {
                'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    address,
                    txn,
                    ref,
                    prizeAmount, 
                    localAmount, 
                    currency,  
                    rate,
                })
            }) 
            const data =  await res.json()
        console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleNewPoolerDeposit = async(ref: string) => {
        const amountParsed = parseUnits(amountDollar!, 6)
        const txnHash = await dripSusuPool(`0x${address!.slice(2)}`, amountParsed!)
        //save offchain depo info
        if (txnHash) {
            await postPoolerDeposit( address!, txnHash!, ref, amountDollar!, amountLocal!, country.code, country.$rate )
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
                                <label>{country.code}</label>
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
                    <button disabled={ amountLocal == null || amountLocal == '' || Number(amountLocal) < Number(country.$rate) } onClick={doLocalPay}>Save to Susu</button>
                </div>
            </main>
        </>
    )
}