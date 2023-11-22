import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useBiconomy } from '@/providers/BiconomyProvider'
import { erc20ABI, useContractRead } from 'wagmi'
import { useEffect } from 'react'
import { useMagic } from '@/providers/MagicProvider'
import { useRouter } from 'next/router'
import { useGet } from '@/hooks/useGet'



const inter = Inter({ subsets: ['latin'] })

export default function Susu() {
    const {magic} = useMagic()
    const { smartAccount, smartAccountAddress } = useBiconomy()
    const route = useRouter()
    const {data, loading, getBack} = useGet('api/getPooler', smartAccountAddress!)
    console.log(data)
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
                    <button>Deposit to Susu</button>
                </div>
            </main>
        </>
    )
}