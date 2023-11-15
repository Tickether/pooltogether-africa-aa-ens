import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useMagic } from '@/hooks/MagicProvider'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  
  // Initialize the Magic instance
  const { magic } = useMagic();
 
  const Login = async () => {
    try {
      const log = await magic?.wallet.connectWithUI()
    } catch (error) {
      console.log(error)
    }
  }
  const Lougot = async () => {
    try {
      await magic?.wallet.showUI()
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
        <>PoolTogether Africa</>
        <button onClick={Login}>login</button>
        <button onClick={Lougot}>logout</button>
      </main>
    </>
  )
}
