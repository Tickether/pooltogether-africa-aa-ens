import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useMagic } from '@/providers/MagicProvider'
import { useRouter } from 'next/router'
import { useBiconomy } from '@/providers/BiconomyProvider'
import { useGet } from '@/hooks/useGet'
import { useEffect, useState } from 'react'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  
  // Initialize the Magic x Biconomy instance
  const {magic} = useMagic()
  const route = useRouter()
  const { smartAccount, smartAccountAddress } = useBiconomy()
  //const [connected, setConnected] = useState<boolean | null>(null)
  //const [email, setEmail] = useState<string | null>(null)
  
  //const {data, loading, getBack} = useGet('api/getPooler', smartAccountAddress!)


  
  const Login = async () => {
    try {
      let isLoggedIn = await magic?.user.isLoggedIn()
      if (isLoggedIn) {
        route.push('/susu')
      } else {
        await magic?.wallet.connectWithUI()
        isLoggedIn = await magic?.user.isLoggedIn()    
      }   
      //createBiconomyAccount if connected
    } catch (error) {
      console.log(error)
    }
  }



  const handleGetProfile = async(address: string) => {
    try {
      const res = await fetch('api/getPooler', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            address
        })
    })
      const data = await res.json()
      console.log(data)
      return data
    } catch (error) {
      console.log(error)
    }
  }

  const handleNewProfile = async (address: string, email: string) => {
    try {
      const res = await fetch('api/postPooler', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          address,
          email,
        })
      }) 
      const data =  await res.json()
      console.log(data)
    } catch (error) {
        console.log(error)
    }
  }

  const handleLoggin = async() => {
    const isLoggedIn = await magic?.user.isLoggedIn()  
    if (isLoggedIn) {
      const profile =  await handleGetProfile(smartAccountAddress!)
      if (profile) {
        route.push('/susu')
      } else {
        const userInfo = await magic?.user.getInfo()
        const email = userInfo?.email
        handleNewProfile(smartAccountAddress!, email!)
        route.push('/susu')
      }
    }
  }

  useEffect(()=>{
    handleLoggin()
  },[smartAccountAddress!])

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
