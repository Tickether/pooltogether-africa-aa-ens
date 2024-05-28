'use client'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { DoubleArrowDownIcon } from '@radix-ui/react-icons'
import { Copy, SkipBack, Terminal, Vault } from 'lucide-react'
import { Pooler } from '@/hooks/pooler/useGetPooler'
import { useEffect, useState } from 'react'
import { usePostDeposit } from '@/hooks/deposit/usePostDeposit'
import { erc20Abi, formatUnits, parseEther, parseUnits } from 'viem'
import { Ramp } from '../ramp/Ramp'
import { useGetCountries } from '@/hooks/cashRamp/useGetCountries'
import { useGetRates } from '@/hooks/cashRamp/useGetRates'
import { Separator } from '../ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Switch } from '../ui/switch'
import { useBalance, useBlockNumber, useWatchContractEvent } from 'wagmi'
import { USDC, WETH } from '@/utils/constants/addresses'
import { usePoolDeposit } from '@/hooks/deposit/usePoolDeposit'
import { useGetPayment } from '@/hooks/cashRamp/useGetPayment'
import { useQueryClient } from '@tanstack/react-query'
import { base } from 'viem/chains'
import { useSwapReward } from '@/hooks/reward/useSwapReward'


interface DepositProps {
    pooler: Pooler
    smartAccountAddress: `0x${string}`
    getBackTransactions: () => void
    rewardBalance: string
}



export function Deposit ({ pooler, smartAccountAddress, getBackTransactions, rewardBalance } : DepositProps) {
    const { countries } = useGetCountries()
    console.log(countries)
        


    const { postDeposit } = usePostDeposit()
    const { loading, poolDeposit } = usePoolDeposit()
    const { loading: loadingSwapReward, swapReward } = useSwapReward()

    

    const { rates } = useGetRates()
    console.log(rates)
    const [open, setOpen] = useState<boolean>(false)
    const [showAddress, setShowAddress] = useState<boolean | null>()

    const [openCashRamp, setOpenCashRamp] = useState<boolean>(false)
    const [reference, setReference] = useState<string | null>(null)
    const [paymentService, setPaymentService] = useState<string | null>(null)

    
    const { payment, getPayment } = useGetPayment()
    console.log(payment)

    const queryClient = useQueryClient() 
    const { data: blockNumber } = useBlockNumber({ watch: true }) 

    const {data: balance, queryKey} = useBalance({
        address: `0x${smartAccountAddress?.slice(2)}`,
        token: USDC,
        chainId: base.id
    })

    useEffect(() => { 
        queryClient.invalidateQueries({ queryKey }) 
    }, [blockNumber, queryClient, queryKey]) 

    const formatedBalance = balance ? formatUnits(balance?.value!, balance?.decimals!) : '0'

    useWatchContractEvent({
        address: USDC,
        abi: erc20Abi,
        batch: false,
        eventName: 'Transfer',
        args: {
            to: smartAccountAddress
        },
        onLogs(logs) {
          console.log('New logs!', logs[0].args.value)
          const makePooling = async() => {
            const amount = formatUnits(logs[0].args.value!, 6)
            const poolTxn = await poolDeposit(amount, smartAccountAddress)
            await postDeposit(
                smartAccountAddress,
                logs[0].args.from!,
                poolTxn!,
                amount,
                'deposit'
            )
            getBackTransactions()
          }
          makePooling()
          
          console.log("Done")
        },
        poll: true,
        pollingInterval: 1_000,
    })
    
    

    /*
    const handleLocalChange = (e: any) => {
        // Allow only numbers and a maximum of two decimal places
        const regex = /^\d*\.?\d{0,2}$/;
        const inputValue = e.target.value;

        if (regex.test(inputValue) || inputValue === '') {
            setAmountLocal(inputValue === '' ? '' : inputValue);
            const dollarRate = parseFloat(inputValue) / parseFloat(rates?.depositRate!);
            setAmountDollar(inputValue === ''? '' : String(dollarRate.toFixed(6)));
        }
    }
    const handleDollarChange = (e: any) => {
        // Allow only numbers and a maximum of two decimal places
        const regex = /^\d*\.?\d{0,6}$/;
        const inputValue = e.target.value;

        if (regex.test(inputValue) || inputValue === '') {
            setAmountDollar(inputValue === '' ? '' : inputValue)
            const localRate = parseFloat(inputValue) * parseFloat(rates?.depositRate!)
            setAmountLocal(inputValue === ''? '' : String(localRate.toFixed(2)))
        }
    }
    */

 

    const doCashRampPay = () => {
        setOpenCashRamp(true)
        const ref = `${smartAccountAddress}-${(new Date()).getTime().toString()}`
        setReference(ref)
        setOpen(false)
    }

    return (
        <>
            <Drawer 
                open={open}
                onClose={()=>{
                    setOpen(false)
                    setPaymentService(null)
                }}
            >
                <DrawerTrigger asChild>
                    <Button 
                        className='gap-2' 
                        variant='outline'
                        onClick={()=>{
                            setOpen(true)
                        }}
                    >
                        <div className='flex items-center'>
                            <DoubleArrowDownIcon/>
                            <Vault size={17}/>
                        </div>
                        <span>Deposit</span>
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className='mx-auto w-full max-w-sm'>
                        <DrawerHeader>
                            {
                                !paymentService && (
                                    <>
                                        <DrawerTitle>Deposit</DrawerTitle>
                                        <DrawerDescription>Choose out of the options & deposit to boost rewards</DrawerDescription>
                                    </>
                                )
                            }  
                            {
                                paymentService == 'direct' && (
                                    <>
                                        <DrawerTitle>Direct Deposit</DrawerTitle>
                                        <DrawerDescription>Transfer USDC on OP to deposit</DrawerDescription>
                                    </>
                                )
                            }   
                        </DrawerHeader>                    
                        {
                            !paymentService && (
                                <>
                                    <div className='flex flex-col p-4 pb-0'>
                                        <div className='flex flex-col gap-3'>
                                            <Button
                                                disabled={loadingSwapReward}
                                                onClick={()=>{
                                                    setPaymentService('direct')
                                                }}
                                            >
                                                <Vault size={17}/>
                                                <p>Direct Deposit</p>
                                            </Button>
                                            <Button
                                                disabled={loadingSwapReward}
                                                onClick={()=>{
                                                    swapReward({
                                                        tokenIn: WETH,
                                                        tokenOut: USDC,
                                                        recipient: smartAccountAddress,
                                                        fee: 500,
                                                        amountIn: parseEther(rewardBalance),
                                                        amountOutMinimum: BigInt(0),
                                                        sqrtPriceLimitX96: BigInt(0),
                                                    })
                                                }}
                                            >
                                                <Vault size={17}/>
                                                <p>Reward Deposit</p>
                                            </Button>
                                        </div>
                                        <p className='text-center'>or</p>
                                        <Separator orientation='horizontal' />
                                        <p className='text-center'>third party exchanges</p>
                                        <Button
                                            disabled={loadingSwapReward}
                                            onClick={doCashRampPay}
                                        >
                                            <Vault size={17}/>
                                            <p>Cashramp</p>
                                        </Button>
                                    </div>
                                </>
                            )
                        }
                        {
                            paymentService == 'direct' && (
                                <>
                                    <div className='flex flex-col p-4 pb-0'>
                                        <span className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <span>Reveal Wallet Address</span>
                                            </div>
                                            <div>
                                                <Switch
                                                    checked={showAddress!}
                                                    onCheckedChange={()=>{
                                                        setShowAddress(!showAddress)
                                                    }}
                                                />
                                            </div>
                                        </span>
                                        <Alert>
                                            <Terminal className='h-4 w-4' />
                                            <AlertTitle className='font-bold'>
                                                <div className='flex items-center justify-between'>
                                                    
                                                    
                                                    {
                                                        !showAddress
                                                        ? <><p className='text-base'>{pooler.ens}.susu.box</p></>
                                                        : <><p className='text-[11px]'>{pooler.address}</p></>
                                                    }
                                                    {
                                                        showAddress && (
                                                            <Copy className='h-5 w-5'/>
                                                        )
                                                    }
                                                </div>
                                            </AlertTitle>
                                            <AlertDescription className='text-xs'>
                                                Send USDC to this wallet. Do not close this window until magic deposit done.
                                            </AlertDescription>
                                        </Alert>

                                        <p className='text-center'></p>
                                    </div>
                                </>
                            )
                        }
                        {
                            true && (
                                <>
                                </>
                            )
                        }
                    <DrawerFooter>
                        {
                            paymentService == 'direct' && (
                                <>
                                <Button
                                    variant='outline'
                                    onClick={()=>{
                                        setPaymentService(null)
                                    }}
                                >
                                    <SkipBack size={17}/>
                                    <p>Back</p>
                                </Button>
                                <div>
                                    <p className='text-center text-xs text-gray-500'>Missing some magic deposits, no worries, 
                                        <Button
                                            disabled={loading! || parseFloat(formatedBalance) == 0}
                                            onClick={async()=>{
                                                const poolTxn = await poolDeposit(formatedBalance, smartAccountAddress!)
                                                await postDeposit(
                                                    smartAccountAddress,
                                                    smartAccountAddress,
                                                    poolTxn!,
                                                    formatedBalance,
                                                    'deposit'
                                                )
                                                getBackTransactions()
                                            }}
                                        >
                                            click here
                                        </Button>
                                    </p>
                                </div>
                                </>
                            )
                        }
                    </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
            {openCashRamp && <Ramp setOpenRamp={setOpenCashRamp} paymentType='deposit' address={smartAccountAddress} reference={reference!} />}
        </>
        
    )
} 
