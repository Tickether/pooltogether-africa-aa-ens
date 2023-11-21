import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useBiconomy } from '@/providers/BiconomyProvider'
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3'
import { useMagic } from '@/providers/MagicProvider'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  
  // Initialize the Magic x Biconomy instance
  const {magic} = useMagic()
  const { smartAccount, smartAccountAddress } = useBiconomy()

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
 
  const Login = async () => {
    try {
      await magic?.wallet.connectWithUI()
      //createBiconomyAccount if connected
    } catch (error) {
      console.log(error)
    }
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
    } catch (error) {
      console.log(error)
    }
  }

  
  

  return (
    <>
      <Head>
        <title>PoolTogether Africa</title>
        <meta name="description" content="No Loss Prize Savings" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <>Welcome to PoolTogether Africa</>
        {
          smartAccountAddress!
          ? <p>This is Smart Account Address: {smartAccountAddress}</p>
          : <p>Click the Login below to get your wallet address</p>
        }
        <button onClick={Login}>login</button>
        <button onClick={doLocalPay}>pay</button>
        <button onClick={Lougot}>logout</button>
        
      </main>
    </>
  )
}
