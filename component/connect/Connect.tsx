import styles from './Connect.module.css'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'


interface ConnectProps {
  setOpenConnectModal: (openConnectModal : boolean) => void
}

export function Connect({ setOpenConnectModal } : ConnectProps) {
  const { connector, isConnected } = useAccount()
  const { connect, error, connectors, isLoading, pendingConnector } = useConnect()
  const { disconnect } = useDisconnect()
  const router = useRouter()

  
  useEffect(() => {
    if (isConnected) {
      router.push('/susu')
    }
  }, [isConnected])

  return (
    <main className={styles.main}>
      <div className={styles.wrapper}>
        {connectors
          .filter((x) => x.ready && x.id !== connector?.id)
          .map((x) => (
            <button key={x.id} onClick={() => connect({ connector: x })}>
              {x.name}
              {isLoading && x.id === pendingConnector?.id && ' (connecting)'}
            </button>
          ))}
          {error && <div>{error.message}</div>}
      </div>
    </main>
  )
}