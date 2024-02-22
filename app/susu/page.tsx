'use client'


import { Balances } from '@/components/balances/Balances'
import { Deposit } from '@/components/deposit/Deposit'
import { Logout } from '@/components/logout/Logout'
import { Profile } from '@/components/profile/Profile'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Withdraw } from '@/components/withdraw/Withdraw'
import { useGetPooler } from '@/hooks/pooler/useGetPooler'
import { useBiconomy } from '@/providers/BiconomyContext'
import { usePrivy } from '@privy-io/react-auth'
import { Terminal } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Susu () {
    const { ready, authenticated } = usePrivy()
    const { smartAccount, smartAccountAddress } = useBiconomy()
    const router = useRouter() 
    const { pooler, loading, getBackPooler } = useGetPooler('api/getPooler/', smartAccountAddress!)
    
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
                                    <Alert>
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
                                <main className='flex min-h-screen flex-col items-center gap-20 p-24 max-md:p-6'>
                                    <div className='flex w-full items-center justify-between'>
                                        <div>
                                            <p className='text-lg font-semibold'>Susu Club</p>
                                        </div>
                                        <div className='flex gap-3'>
                                            {smartAccountAddress && pooler && !loading && (
                                                <>
                                                    <Profile pooler={pooler} smartAccountAddress={smartAccountAddress!} getBackPooler={getBackPooler}/>
                                                    <Withdraw pooler={pooler!} smartAccount={smartAccount!}/>
                                                    <Logout/>
                                                </>
                                            )}
                                            
                                        </div>
                                    </div>
                                    <div className='flex w-full items-center justify-center'>
                                        {
                                            !pooler || loading
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
                                            !smartAccountAddress && !pooler && loading && <p>loading...</p>
                                        }
                                        {
                                            smartAccountAddress && pooler && !loading && <Balances smartAccountAddress={smartAccountAddress!}/>
                                        }
                                    </div>
                                    { smartAccountAddress && pooler && !loading && <Deposit pooler={pooler!} smartAccountAddress={smartAccountAddress!}/>}
                                    
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

