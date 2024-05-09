'use client'

import { MinusIcon, PlusIcon } from '@radix-ui/react-icons' 
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
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
import { Countries, Country } from '@/utils/constants/countries'
import { useState } from 'react'
import { usePostDeposit } from '@/hooks/deposit/usePostDeposit'
import { useUpdateDeposit } from '@/hooks/deposit/useUpdateDeposit'
import { erc20Abi, formatUnits, parseUnits } from 'viem'
import { Ramp } from '../ramp/Ramp'
import { useGetCountries } from '@/hooks/cashRamp/useGetCountries'
import { useGetRates } from '@/hooks/cashRamp/useGetRates'
import { Separator } from '../ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Switch } from '../ui/switch'
import { useWatchContractEvent } from 'wagmi'
import { USDC, przUSDC } from '@/utils/constants/addresses'
import { usePoolDeposit } from '@/hooks/deposit/usePoolDeposit'
import { BiconomySmartAccountV2, PaymasterMode } from '@biconomy/account'
import { allowance } from '@/utils/deposit/allowance'
import { approveLifeTimeSwim } from '@/utils/deposit/approve'
import { deposit } from '@/utils/deposit/deposit'


interface DepositProps {
    pooler: Pooler
    smartAccount: BiconomySmartAccountV2
    smartAccountAddress : `0x${string}`
    getBackTransactions : () => void
}



export function Deposit ({ pooler, smartAccount, smartAccountAddress, getBackTransactions } : DepositProps) {
    const { countries } = useGetCountries()
    console.log(countries)
        


    const { postDeposit } = usePostDeposit()
    const { updateDeposit } = useUpdateDeposit() 
    const { loading, poolDeposit } = usePoolDeposit()

    const countryFromRamp = countries ? countries!.find(country => country.name === pooler.country) : {name: '', code: ''}
    const country : Country = ( Countries as any )[pooler.country]
    console.log(country)

    const { rates } = useGetRates()
    console.log(rates)
    const [open, setOpen] = useState<boolean | null>()
    const [showAddress, setShowAddress] = useState<boolean | null>()

    const [openCashRamp, setOpenCashRamp] = useState<boolean>(false)
    const [reference, setReference] = useState<string | null>(null)
    const [paymentService, setPaymentService] = useState<string | null>(null)
    const [amountLocal, setAmountLocal] = useState<string>('')
    const [amountDollar, setAmountDollar] = useState<string>('')
    /*
    const poolDeposit = async (amountDollar: string, smartAccountAddress: `0x${string}`) => {
        
        const amountParsed = parseUnits(amountDollar!, 6)
        console.log('step1', amountParsed)
        const allowance_ = await allowance(smartAccountAddress, przUSDC)
        console.log('step2', allowance_)
        let userOpResponse
        let txnHash
        if (amountParsed < allowance_ || allowance_ == BigInt(0)) {
            // send two
            const tx = []
            const tx1 = approveLifeTimeSwim(przUSDC)
            console.log('step3', tx1)
            tx.push(tx1)
            const tx2 = deposit(amountParsed, smartAccountAddress)
            console.log('step4', tx2)
            tx.push(tx2)
            // Send the transaction and get the transaction hash
            const userOpResponse = await smartAccount!.sendTransaction(tx, {
                paymasterServiceData: {mode: PaymasterMode.SPONSORED},
            });
            console.log('step5', userOpResponse)
            const { transactionHash } = await userOpResponse.waitForTxHash();
            console.log("Transaction Hash", transactionHash);
            txnHash = transactionHash

        }else {
            // send one
            const tx = deposit(amountParsed, smartAccountAddress)
            console.log('step3', tx)
            // Send the transaction and get the transaction hash
            userOpResponse = await smartAccount!.sendTransaction(tx, {
                paymasterServiceData: {mode: PaymasterMode.SPONSORED},
            });
            const { transactionHash } = await userOpResponse.waitForTxHash();
            console.log("Transaction Hash", transactionHash);
            txnHash = transactionHash

        }

        
        const userOpReceipt  = await userOpResponse!.wait();
        if(userOpReceipt.success == 'true') { 
            console.log("UserOp receipt", userOpReceipt)
            console.log("Transaction receipt", userOpReceipt.receipt)
            //save offchain depo info
            //await updateDeposit(ref, txnHash!, 'success')
        }
    }
    */

    useWatchContractEvent({
        address: USDC,
        chainId: 10,
        abi: erc20Abi,
        eventName: 'Transfer',
        args: {
            to: smartAccountAddress
            
        },
        onLogs(logs) {
          console.log('New logs!', logs[0].args.value)
          const amount = formatUnits(logs[0].args.value!, 6)
          poolDeposit(amount, smartAccountAddress)
          getBackTransactions()
          console.log("Done")
        },
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
        const ref = `${country.currency}-${(new Date()).getTime().toString()}`
        setReference(ref)
        setOpen(false)
    }

    return (
        <>
            <Drawer open={open!}>
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
                                    <div className='flex flex-col'>
                                        <Button
                                            onClick={()=>{
                                                setPaymentService('direct')
                                            }}
                                        >
                                            <Vault size={17}/>
                                            <p>Direct Deposit</p>
                                        </Button>
                                        <p className='text-center'>or</p>
                                        <Separator orientation='horizontal' />
                                        <p className='text-center'>third party exchanges</p>
                                        <Button
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
                                    <div className='flex flex-col'>
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
                                                : <><p className='text-xs'>{pooler.address}</p></>
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
                                    onClick={()=>{
                                        setPaymentService(null)
                                    }}
                                >
                                    <SkipBack size={17}/>
                                    <p>Back</p>
                                </Button>
                                <div>
                                    <p className='text-center text-xs text-gray-500'>Missing some magic deposits, no worries, <Button
                                        disabled={loading!}
                                        onClick={()=>{
                                            poolDeposit('0.05', smartAccountAddress!)
                                            getBackTransactions()
                                        }}
                                    >click here</Button></p>
                                </div>
                                </>
                            )
                        }
                        
                    </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
            {openCashRamp && <Ramp setOpenRamp={setOpenCashRamp} paymentType='deposit' address={smartAccountAddress} amount={amountDollar} reference={reference!} currency={countryFromRamp?.code!}/>}
        </>
        
      )
} 
