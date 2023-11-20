import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useMagicBiconomy } from '@/hooks/MagicBiconomyProvider'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  
  // Initialize the Magic x Biconomy instance
  const { magic, smartAccount, smartAccountAddress, createBiconomyAccount, logoutBiconomyAccount } = useMagicBiconomy()
 
  const Login = async () => {
    try {
      createBiconomyAccount()
    } catch (error) {
      console.log(error)
    }
  }
  const showUI = async () => {
    try {
      await magic?.wallet.showUI()
    } catch (error) {
      console.log(error)
    }
  }


  const Lougot = async () => {
    try {
      logoutBiconomyAccount()
    } catch (error) {
      console.log(error)
    }
  }

  const Lougotinfo = async () => {
    console.log(smartAccount )
    console.log(smartAccountAddress, )
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
          smartAccountAddress
          ? <p>This is Smart Account Address: {smartAccountAddress}</p>
          : <p>Click the Login below to get your wallet address</p>
        }
        <button onClick={Login}>login</button>
        <button onClick={showUI}>showUI</button>
        <button onClick={Lougotinfo}>logout INfo</button>
        <button onClick={Lougot}>logout</button>
      </main>
    </>
  )
}
