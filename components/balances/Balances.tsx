'use client'

import { useBalance, useBlockNumber } from 'wagmi'
import { Separator } from '../ui/separator'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { formatUnits } from 'viem'
import { optimism } from 'viem/chains'
import { trimDecimals } from '@/utils/trim'
import { przUSDC } from '@/utils/constants/addresses'

interface BalancesProp{
    balance: string
}

export function Balances ({ balance }: BalancesProp) {

    return (
        <>
            <main className='flex flex-col w-full items-center gap-24'>
                {/**Misc Balances */}
                <div className='flex flex-col w-full items-center'>
                    <Separator className='my-4 max-md:mb-8'  />
                    <div className='flex h-5 items-center space-x-4 text-sm'>
                        <div>
                            <p className='font-semibold max-md:text-center'>Rewards Balance</p>
                            <p className='text-center'><span>$</span>0</p>
                        </div>
                        <Separator orientation='vertical' />
                        <div>
                            <p className='font-semibold max-md:text-center'>Total Rewards</p>
                            <p className='text-center'><span>$</span>0</p>
                        </div>
                        <Separator orientation='vertical' />
                        <div>
                            <p className='font-semibold max-md:text-center'>Rewards Boost</p>
                            <p className='text-center'><span>$</span>0</p>
                        </div>
                    </div>
                </div>
                {/**Susu Balance */}
                <div className='flex'>
                    <span className='text-xl max-md:text-optimism text-gray-700'>$</span>
                    <p className='text-6xl max-md:text-3xl max-md:text-center font-bold text-center'>
                        {trimDecimals(balance!)}
                    </p>
                </div>
            </main>
        </>
    )
}