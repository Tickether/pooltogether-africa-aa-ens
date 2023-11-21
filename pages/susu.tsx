import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useBiconomy } from '@/providers/BiconomyProvider'
import { erc20ABI, useContractRead } from 'wagmi'
import { } from 'react'
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3'
import { useMagic } from '@/providers/MagicProvider'
import { useRouter } from 'next/router'
import { useEffect } from "react"


const inter = Inter({ subsets: ['latin'] })

export default function Susu() {
    const {magic} = useMagic()
    const { smartAccount, smartAccountAddress } = useBiconomy()
    const route = useRouter()
 
    const goLanding = async() => {
        try {
            let isLoggedIn = await magic?.user.isLoggedIn()
            if(!isLoggedIn) route.push('/')
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        goLanding()
    },[])


    const ptAfricaBalance = useContractRead({
        address: '0xE3B3a464ee575E8E25D2508918383b89c832f275', //pUSDC.e
        abi: erc20ABI,
        functionName: 'balanceOf',
        args:[(`0x${smartAccountAddress?.slice(2)}`)],
        chainId: 10,
        watch: true
    })
    

    const config = {
        public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_KEY,
        tx_ref: '0',
        amount: 1,
        currency: 'GHS',
        payment_options: 'mobilemoney',
        customer: {
          email: 'tickether@gmail.com',
           phone_number: '233531616924',
          name: 'john doe',
        },
        customizations: {
          title: 'PoolTogether Africa',
          description: 'Payment for items in cart',
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

    
    const Lougot = async () => {
        try {
            await magic?.user.logout()
            await goLanding()
        } catch (error) {
        console.log(error)
        }
    }
    
    return(
        <>
            <Head>
                <title>Susu - PoolTogether Africa </title>
                <meta name="description" content="No Loss Prize Savings" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={`${styles.main} ${inter.className}`}>
                <div>
                    <button onClick={Lougot}>Close Susu Vault</button>
                </div>
                <div className={styles.saving}>
                    {
                    smartAccountAddress!
                    ? <p>This is Smart Account Address: {smartAccountAddress}</p>
                    : <p>loading</p>
                    }
                </div>
                <div className={styles.saving}>
                    {
                        smartAccountAddress
                        ? <div>This is Smart Account Balance: {Number(ptAfricaBalance?.data!)} pUSDC.e</div>
                        : <div>{'loading'}</div>
                    }
                </div>
                <div className={styles.winnings}>
                    
                </div>
                <div>
                    <button onClick={doLocalPay}>Save to Susu</button>
                </div>
            </main>
        </>
    )
}