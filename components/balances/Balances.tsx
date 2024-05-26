'use client'


import { Gem } from 'lucide-react'
import { Separator } from '../ui/separator'
import { trimDecimals } from '@/utils/trim'
import { useEffect, useState } from 'react'
import { getRewardUSD } from '@/utils/getRewardUSD'

interface BalancesProp{
    balance: string
    rewardBalance: string
    boostBalance: string

}

export function Balances ({ balance, rewardBalance, boostBalance }: BalancesProp) {


    const [tokenRateUSD, setTokenRateUSD] = useState<string | null>(null);

    console.log(tokenRateUSD!)
    useEffect(() => {
        const getTokenRateUSD = async () => {
          const TokenRateUSD = await getRewardUSD(rewardBalance);
          setTokenRateUSD(TokenRateUSD!);
        };
        getTokenRateUSD();
        const intervalId = setInterval(getTokenRateUSD, 300000) 
        return () => {
            // Cleanup function to clear the interval when the component unmounts
            clearInterval(intervalId)
        }
    }, [rewardBalance]);

    return (
        <>
            <main className='flex flex-col w-full items-center gap-24'>
                {/**Misc Balances */}
                <div className='flex flex-col w-full items-center'>
                    <Separator className='my-4 max-md:mb-8'  />
                    <div className='flex h-5 items-center space-x-4 text-sm'>
                        <div className='items-center'>
                            <p className='font-semibold max-md:text-center'>Rewards Balance</p>
                            <div className='flex items-center gap-0.5'>
                                <Gem size={15}/>
                                <p>{rewardBalance} ~</p>
                                <div><p className='text-center'><span>$</span>{tokenRateUSD}</p></div>
                            </div>
                        </div>
                        <Separator orientation='vertical' />
                        <div>
                            <p className='font-semibold max-md:text-center'>Rewards Boost</p>
                            <p className='text-center'><span>$</span>{boostBalance}</p>
                        </div>
                    </div>
                </div>
                {/**Susu Balance */}
                <div className='flex'>
                    <span className='text-xl max-md:text-base text-gray-700'>$</span>
                    <p className='text-6xl max-md:text-3xl max-md:text-center font-bold text-center'>
                        {trimDecimals(balance!)}
                    </p>
                </div>
            </main>
        </>
    )
}