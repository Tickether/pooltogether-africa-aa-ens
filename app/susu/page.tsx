'use client'


import styles from './page.module.css'
import { Disconnect } from '@/component/disconnect/Disconnect'
import { useAccount, useBalance } from 'wagmi'
import { useState } from 'react'
import { useGetPooler } from '@/hooks/useGetPooler'
import Deposit from '@/component/deposit/deposit'
import Profile from '@/component/profile/profile'
import Transactions from '@/component/transactions/transactions'
import Withdraw from '@/component/withdraw/withdraw'
import Image from 'next/image'

export default function Susu() {
    const { address, isConnected } = useAccount()   
    const { pooler, loading, getBackPooler } = useGetPooler('api/getPooler/', address!)
    console.log(pooler?.address)

    const [openDepositModal, setOpenDepositModal] = useState<boolean>(false) 
    const [openProfileModal, setOpenProfiletModal] = useState<boolean>(false) 
    const [openTransactionsModal, setOpenTransactionsModal] = useState<boolean>(false) 
    const [openWithdrawModal, setOpenWithdrawModal] = useState<boolean>(false) 
    const [poolWon, setPoolWon] = useState<string>('0') 

    

    const smartWallet = address ? address! : '0xdEAD000000000000000042069420694206942069'
    const susuBalance = useBalance({
        address: `0x${smartWallet?.slice(2)}`,
        token: '0xc3d6a8d76B304E0716b3227C00a83187340DC846',
        watch: true,
    })
    const poolBalance = useBalance({
        address: `0x${smartWallet?.slice(2)}`,
        token: '0x0Ec780bE0191f8A364FAccdE91D13BE6F96632bE',
        watch: true,
    })

    
    // Function to be called when the profile modal is closed
    const onProfileClose = async() => {
        console.log('Modal is closed! Do something...');
        // reloaad data from db
        await getBackPooler()
    };
    const onDepositClose = async() => {
        console.log('Modal is closed! Do something...');
        // reloaad data from db
    }
    const onWithdrawClose = async() => {
        console.log('Modal is closed! Do something...');
        // reloaad data from db
    }

    return (
        <>
            <main className={styles.main}>
                <div className={styles.control}>
                    <Disconnect />
                    <div className={styles.panel}>                    
                        <button onClick={()=> setOpenProfiletModal(true)}>Profile</button>
                        <button disabled={!pooler} onClick={()=> setOpenTransactionsModal(true)}>Transactions</button>
                        <button disabled={!pooler} onClick={()=> setOpenWithdrawModal(true)}>Withdraw</button>
                    </div>
                </div>
                <div className={styles.welcome}>
                    {
                    address!
                    ? <><h2>Hi 👋🏾</h2>{ pooler ? <p><span>{pooler?.ens}</span>.pooltogether.africa</p> : <><p>⚠️Setup your profile & make deposits🚧</p></>}</>
                    : <p>loading</p>
                    }
                </div>
                <div className={styles.susuing}>
                    {
                        address
                        ? <div className={styles.balance}> <p>Your Susu Balance:</p> <span>$USD {susuBalance.data?.formatted}</span> </div>
                        : <div>{'loading'}</div>
                    }
                </div>
                <div className={styles.boost}>
                    {
                        address
                        ? <div className={styles.balance}><p>Winnings Boost Balance:</p> <span>$USD {0}</span> </div>
                        : <div>{'loading'}</div>
                    }
                </div>
                <div className={styles.winnings}>
                    {
                        address
                        ? <div className={styles.balance}><p>Your Winnings Balance:</p> <span>$POOL {poolBalance.data?.formatted}</span> </div>
                        : <div>{'loading'}</div>
                    }
                </div>
                <div className={styles.won}>
                    {
                        address
                        ? <div className={styles.balance}><p>Total Winnings Balance:</p> <span> $POOL {poolWon}</span></div>
                        : <div>{'loading'}</div>
                    }
                </div>
                <div className={styles.deposit}>
                    <button disabled={!pooler} onClick={()=> setOpenDepositModal(true)}>Deposit to Susu</button>
                </div>
                {openDepositModal && <Deposit pooler={pooler!} address={address!} setOpenDepositModal={setOpenDepositModal} onDepositClose={onDepositClose}/>}
                {openProfileModal && <Profile pooler={pooler} address={address!} setOpenProfiletModal={setOpenProfiletModal} onProfileClose={onProfileClose}/>}
                {openTransactionsModal && <Transactions pooler={pooler!} setOpenTransactionsModal={setOpenTransactionsModal} />}
                {openWithdrawModal && <Withdraw pooler={pooler!} setOpenWithdrawModal={setOpenWithdrawModal} onWithdrawClose={onWithdrawClose}/>}
            </main>
        </>
    )
}

/*
            <div className={styles.background}>
                <Image
                    src='BG3.svg'
                    alt='Background'
                    layout='fill'
                    objectFit='cover'
                />
            </div>
*/