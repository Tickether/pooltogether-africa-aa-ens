'use client'


import styles from './page.module.css'
import { Disconnect } from '@/component/disconnect/Disconnect'
import { useAccount, useContractRead } from 'wagmi'
//import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useGetPooler } from '@/hooks/useGetPooler'
import Deposit from '@/component/deposit/deposit'
import Profile from '@/component/profile/profile'
import Transactions from '@/component/transactions/transactions'
import Withdraw from '@/component/withdraw/withdraw'
import { erc20ABI } from '@/utils/abis/ptaABI'
import { formatUnits } from 'viem'

export default function Susu() {
    const { address, isConnected } = useAccount()   
    const { pooler, loading, getBackPooler } = useGetPooler('api/getPooler/', address!)
    console.log(pooler?.address)

    const [openDepositModal, setOpenDepositModal] = useState<boolean>(false) 
    const [openProfileModal, setOpenProfiletModal] = useState<boolean>(false) 
    const [openTransactionsModal, setOpenTransactionsModal] = useState<boolean>(false) 
    const [openWithdrawModal, setOpenWithdrawModal] = useState<boolean>(false) 
/*
    const doLoading = async() => {
        try {

            console.log(address)
            console.log(isConnected)
            if( !address && !isConnected ) {
                console.log('loading..')
            } else {
                console.log('loaded!')
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        doLoading()
    },[address, isConnected])
*/
    const smartWallet = address ? address! : '0xdEAD000000000000000042069420694206942069'
    const ptAfricaBalance = useContractRead({
        address: '0xc3d6a8d76B304E0716b3227C00a83187340DC846', ///pUSDC-HY-T
        abi: erc20ABI,
        functionName: 'balanceOf',
        args:[(`0x${smartWallet?.slice(2)}`)],
        watch: true
    })
    console.log(ptAfricaBalance.data)
    
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
        <main className={styles.main}>
        <div>
            <Disconnect />
        </div>
        <div className={styles.saving}>
            {
            address!
            ? <p>This is Smart Account Address: {address}</p>
            : <p>loading</p>
            }
        </div>
        <div>
            {
                address! && !pooler
                ?(
                    <div>
                        <p>Setup your profile & Make your first Deposit</p>
                    </div>
                )
                :<></>
            }
        </div>
        <div className={styles.saving}>
            {
                address
                ? <div>Your Susu Balance: {formatUnits((ptAfricaBalance?.data!), 6)} pUSDC-HY-T</div>
                : <div>{'loading'}</div>
            }
        </div>
        <div className={styles.winnings}>
            
        </div>
        <div>
            <button disabled={!pooler} onClick={()=> setOpenDepositModal(true)}>Deposit to Susu</button>
            <button onClick={()=> setOpenProfiletModal(true)}>Profile</button>
            <button disabled={!pooler} onClick={()=> setOpenTransactionsModal(true)}>Transactions</button>
            <button disabled={!pooler} onClick={()=> setOpenWithdrawModal(true)}>Withdraw from Susu</button>
        </div>
        {openDepositModal && <Deposit pooler={pooler!} address={address!} setOpenDepositModal={setOpenDepositModal} onDepositClose={onDepositClose}/>}
        {openProfileModal && <Profile pooler={pooler} address={address!} setOpenProfiletModal={setOpenProfiletModal} onProfileClose={onProfileClose}/>}
        {openTransactionsModal && <Transactions pooler={pooler!} setOpenTransactionsModal={setOpenTransactionsModal} />}
        {openWithdrawModal && <Withdraw pooler={pooler!} setOpenWithdrawModal={setOpenWithdrawModal} onWithdrawClose={onWithdrawClose}/>}
    </main>
    )
}
