import styles from './Disconnect.module.css'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

/*
interface ConnectProps {
  setOpenDisconnectModal: (openConnectModal : boolean) => void
  //onDepositClose: () => void
}
*/

export function Disconnect() {
  const router = useRouter()
  const {  isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  

  

  return (
    <main className={styles.main}>
      <div className={styles.wrapper}>
        {isConnected && (
          <button onClick={() => {
            disconnect()
            router.push('/')
          }}>
            Close Susu Vault
          </button>
        )}
      </div>

      
    </main>
  )
}