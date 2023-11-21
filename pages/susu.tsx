import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useBiconomy } from '@/providers/BiconomyProvider'
import { erc20ABI, useContractRead } from 'wagmi'
import { } from 'react'


const inter = Inter({ subsets: ['latin'] })

export default function Susu() {
    const { smartAccount, smartAccountAddress } = useBiconomy()
 
    const ptAfricaBalance = useContractRead({
        address: '0xE3B3a464ee575E8E25D2508918383b89c832f275', //pUSDC.e
        abi: erc20ABI,
        functionName: 'balanceOf',
        args:[(`0x${smartAccountAddress?.slice(2)}`)],
        chainId: 10,
        watch: true
    })
    
    return(
        <>
            <Head>
                <title>Susu - PoolTogether Africa </title>
                <meta name="description" content="No Loss Prize Savings" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={`${styles.main} ${inter.className}`}>
                <div className={styles.saving}>
                    {
                        smartAccountAddress
                        ? <>{Number(0)}</>
                        : <>'loading'</>
                    }
                </div>
                <div className={styles.winnings}>
                    
                </div>
            </main>
        </>
    )
}