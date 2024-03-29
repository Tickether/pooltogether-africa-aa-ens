'use client'


import { Balances } from '@/components/balances/Balances'
import { Deposit } from '@/components/deposit/Deposit'
import { Logout } from '@/components/logout/Logout'
import { Profile } from '@/components/profile/Profile'
import { Transactions } from '@/components/transactions/Transactions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Withdraw } from '@/components/withdraw/Withdraw'
import { useGetPooler } from '@/hooks/pooler/useGetPooler'
import { useGetTransactions } from '@/hooks/transactions/useGetTransactions'
import { useBiconomy } from '@/providers/BiconomyContext'
import { usePrivy } from '@privy-io/react-auth'
import { Terminal } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Susu () {
    const { ready, authenticated } = usePrivy()
    const { smartAccount, smartAccountAddress } = useBiconomy()
    const router = useRouter() 
    const { pooler, loading, getBackPooler } = useGetPooler('api/getPooler/', smartAccountAddress!)
    const { transactions, getBackTransactions } = useGetTransactions('api/getTransactions/', smartAccountAddress!)
    
    return (
        <>
            {
                !ready 
                ?(
                    <>
                        <main className='flex min-h-screen flex-col items-center justify-between p-24'>
                            <p>loading....</p>
                        </main>
                    </>
                )
                :(
                    <>
                    {
                        !authenticated
                        ?(
                            <>
                                <main className='flex min-h-screen flex-col items-center justify-between p-24'>
                                    <Alert className='w-108'>
                                        <Terminal className="h-4 w-4" />
                                        <AlertTitle>Login First!</AlertTitle>
                                        <AlertDescription>
                                            You cannot view the Susu account without being Logged in.
                                        </AlertDescription>
                                    </Alert>
                                    <Button
                                        onClick={()=>{
                                            router.push('/')
                                        }}
                                    >
                                        Go to Home
                                    </Button>
                                </main>
                            </>
                        )
                        :(
                            <>
                                <main className='flex min-h-screen flex-col items-center gap-8 p-24 max-md:p-6'>
                                    <div className='flex w-full items-center justify-between'>
                                        <div className='flex'>
                                            <Image
                                                src=''
                                                alt=''
                                                width={0}
                                                height={0}
                                            />
                                            <p className='text-3xl font-bold'>susu club</p>
                                        </div>
                                        <div className='flex gap-3'>
                                            {
                                                pooler && (
                                                    <Withdraw pooler={pooler!} smartAccount={smartAccount!} smartAccountAddress={smartAccountAddress!} getBackTransactions={getBackTransactions}/>
                                                )
                                            }
                                            <Profile pooler={pooler} smartAccountAddress={smartAccountAddress!} getBackPooler={getBackPooler}/>
                                            <Logout/>
                                        </div>
                                    </div>
                                    <div className='flex w-full items-center justify-center'>
                                        {
                                            !pooler && loading
                                            && (
                                                <>
                                                    <p>loading...</p>
                                                </>
                                            )
                                        }
                                        {
                                            !pooler && !loading
                                            && (
                                                <>
                                                    <Alert className='w-108'>
                                                        <Terminal className="h-4 w-4" />
                                                        <AlertTitle>Create a Profile!</AlertTitle>
                                                        <AlertDescription>
                                                            ⚠️Setup your profile & make deposits🚧
                                                        </AlertDescription>
                                                    </Alert>
                                                </>
                                            )
                                        }
                                        {
                                            pooler && !loading
                                            && (
                                                <>
                                                    <Alert className='w-108'>
                                                        <Terminal className="h-4 w-4" />
                                                        <AlertTitle>Hi 👋🏄 <span className='italic font-semibold'>{pooler?.ens}</span>.susu.pool</AlertTitle>
                                                        <AlertDescription>
                                                            🥳 You are ready to make deposits. Happy Pooling 🙌🏊
                                                        </AlertDescription>
                                                    </Alert>
                                                    <h2></h2> 
                                                </>
                                            )
                                        }
                                    </div>
                                    <div>
                                        {/** Balances */}
                                        {
                                            smartAccountAddress && pooler && !loading && <Balances smartAccountAddress={smartAccountAddress!}/>
                                        }
                                    </div>
                                    { smartAccountAddress && pooler && !loading && <Deposit pooler={pooler!} smartAccountAddress={smartAccountAddress!} getBackTransactions={getBackTransactions}/>  }
                                    {smartAccount && pooler && !loading && <Transactions transactions={transactions!}/>}
                                </main>    
                            </>
                        )
                    }
                    </>
                )
            }
        </>
    )
}

