import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useBiconomy } from '@/providers/BiconomyProvider'
import { erc20ABI, useContractRead } from 'wagmi'
import { useEffect, useState } from 'react'
import { useMagic } from '@/providers/MagicProvider'
import { useRouter } from 'next/router'
import Deposit from '@/components/deposit/deposit'
import Profile from '@/components/profile/profile'
import Transactions from '@/components/transactions/transactions'
import Withdraw from '@/components/withdraw/withdraw'




const inter = Inter({ subsets: ['latin'] })

export default function Susu() {
    const route = useRouter()
    const {magic} = useMagic()
    const { smartAccount, smartAccountAddress, connected } = useBiconomy()

    const [openDepositModal, setOpenDepositModal] = useState<boolean>(false) 
    const [openProfileModal, setOpenProfiletModal] = useState<boolean>(false) 
    const [openTransactionsModal, setOpenTransactionsModal] = useState<boolean>(false) 
    const [openWithdrawModal, setOpenWithdrawModal] = useState<boolean>(false) 

    
    //const {data, loading, getBack} = useGet('api/getPooler', smartAccountAddress!)

 

    const goLanding = async() => {
        try {
            const isLoggedIn = await magic?.user.isLoggedIn()
            console.log(isLoggedIn)
            if( isLoggedIn === false ) route.push('/')
        } catch (error) {
            console.log(error)
        }
    }
    
    

    useEffect(()=>{
        goLanding()
    },[smartAccountAddress, connected])
    

    const smartWallet = smartAccountAddress ? smartAccountAddress! : '0xdEAD000000000000000042069420694206942069'
    const ptAfricaBalance = useContractRead({
        address: '0xE3B3a464ee575E8E25D2508918383b89c832f275', //pUSDC.e
        abi: erc20ABI,
        functionName: 'balanceOf',
        args:[(`0x${smartWallet?.slice(2)}`)],
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
                    <button onClick={()=> setOpenDepositModal(true)}>Deposit to Susu</button>
                    <button onClick={()=> setOpenProfiletModal(true)}>Profile</button>
                    <button onClick={()=> setOpenTransactionsModal(true)}>Transactions</button>
                    <button onClick={()=> setOpenWithdrawModal(true)}>Withdraw from Susu</button>
                </div>
                {openDepositModal && <Deposit smartAccountAddress ={smartAccountAddress!} setOpenDepositModal ={setOpenDepositModal} />}
                {openProfileModal && <Profile smartAccountAddress ={smartAccountAddress!} setOpenProfiletModal ={setOpenProfiletModal} />}
                {openTransactionsModal && <Transactions setOpenTransactionsModal ={setOpenTransactionsModal} />}
                {openWithdrawModal && <Withdraw setOpenWithdrawModal ={setOpenWithdrawModal} />}
            </main>
        </>
    )
}