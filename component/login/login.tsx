'use client'

import styles from './Login.module.css'

import { erc20ABI, useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Connect } from '../connect/Connect'

export default function Login() {
    
    const { address, isConnected } = useAccount()    
    const router = useRouter()

    const [openConnectModal, setOpenConnectModal] = useState<boolean>(false)
    console.log(isConnected)
    const Login = async () => {
        try {
            if (isConnected == true) {
                router.push('/susu')
            }
            if (isConnected == false) {
                setOpenConnectModal(true)
            }
        } catch (error) {
          console.log(error)
        }
    }
    

    return (
        <main className={styles.main}>
            <button onClick={Login}>Check Susu</button>
            {openConnectModal && <Connect setOpenConnectModal={setOpenConnectModal} />}
        </main>
    )
}