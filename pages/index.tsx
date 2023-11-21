import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useMagic } from '@/providers/MagicProvider'
import { useRouter } from 'next/router'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  
  // Initialize the Magic x Biconomy instance
  const {magic} = useMagic()
  const route = useRouter()
  
  
  const Login = async () => {
    try {
      let isLoggedIn = await magic?.user.isLoggedIn()
      if (isLoggedIn) {
        route.push('/susu')
      } else {
        await magic?.wallet.connectWithUI()
        isLoggedIn = await magic?.user.isLoggedIn()
        if (isLoggedIn) route.push('/susu')
      }   
      //createBiconomyAccount if connected
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
        <h1>Welcome to PoolTogether Africa</h1>
        <p>Join millions of Africans saving at least a dollar a day & winning prizes daily!!!</p>
        <p>Click below to check your susu wallet balance or Sign up!</p>
        <button onClick={Login}>Check Susu</button>
      </main>
    </>
  )
}
