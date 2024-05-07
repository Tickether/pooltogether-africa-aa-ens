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
import { Vault } from 'lucide-react'
import { Pooler } from '@/hooks/pooler/useGetPooler'
import { Countries, Country } from '@/utils/constants/countries'
import { useState } from 'react'
import { usePostDeposit } from '@/hooks/deposit/usePostDeposit'
import { useUpdateDeposit } from '@/hooks/deposit/useUpdateDeposit'
import { parseUnits } from 'viem'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useGetTransactions } from '@/hooks/transactions/useGetTransactions'
import { Ramp } from '../ramp/Ramp'
import { useGetCountries } from '@/hooks/cashRamp/useGetCountries'
import { useGetRates } from '@/hooks/cashRamp/useGetRates'
import { Separator } from '../ui/separator'
//import { BiconomySmartAccountV2, PaymasterMode } from '@biconomy/account'


interface DepositProps {
    pooler: Pooler
    //smartAccount: BiconomySmartAccountV2
    smartAccountAddress : `0x${string}`
    //getBackTransactions : () => void
}



export function Deposit ({ pooler, smartAccountAddress } : DepositProps) {
    const { countries } = useGetCountries()
    console.log(countries)
        


    const { loading, postDeposit } = usePostDeposit()
    const { updateDeposit } = useUpdateDeposit()

    const countryFromRamp = countries ? countries!.find(country => country.name === pooler.country) : {name: '', code: ''}
    const country : Country = ( Countries as any )[pooler.country]
    console.log(country)

    const { rates } = useGetRates()
    console.log(rates)
    const [open, setOpen] = useState<boolean | null>()

    const [openCashRamp, setOpenCashRamp] = useState<boolean>(false)
    const [reference, setReference] = useState<string | null>(null)
    const [paymentService, setPaymentService] = useState<string | null>(null)
    const [amountLocal, setAmountLocal] = useState<string>('')
    const [amountDollar, setAmountDollar] = useState<string>('')

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
    
    /*
    const handleNewDeposit = async(ref: string) => {
        const amountParsed = parseUnits(amountDollar!, 6)
        const allowance_ = await allowance(smartAccountAddress, przUSDC)
        let userOpResponse
        let txnHash
        if (amountParsed < allowance_ || allowance_ == BigInt(0)) {
            // send two
            const tx = []
            const tx1 = approveLifeTimeSwim(przUSDC)
            tx.push(tx1)
            const tx2 = deposit(amountParsed, smartAccountAddress)
            tx.push(tx2)
            // Send the transaction and get the transaction hash
            const userOpResponse = await smartAccount.sendTransaction(tx, {
                paymasterServiceData: {mode: PaymasterMode.SPONSORED},
            });
            const { transactionHash } = await userOpResponse.waitForTxHash();
            console.log("Transaction Hash", transactionHash);
            txnHash = transactionHash

        }else {
            // send one
            const tx = deposit(amountParsed, smartAccountAddress)
            // Send the transaction and get the transaction hash
            userOpResponse = await smartAccount.sendTransaction(tx, {
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
            await updateDeposit(ref, txnHash!, 'success')
        }

        getBackTransactions()
    }
    */

    interface referenceTypes {
        reference: string
    }
    const onSuccess = (reference: referenceTypes) => {
        // Implementation for whatever you want to do with reference and after success call.
        console.log('reference', reference);
        //postDeposit( smartAccountAddress!, '', reference.reference, amountDollar!, amountLocal!, country.currency, rates?.depositRate!, 'pending' )
        //getBackTransactions()
        //handleNewDeposit(reference.reference)

    };
      

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
                        </DrawerHeader>                    
                        {
                            !paymentService && (
                                <>
                                    <div className='flex flex-col'>
                                        <Button>
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
                            paymentService == 'cashramp' && (
                                <>
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
                        
                    </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
            {openCashRamp && <Ramp setOpenRamp={setOpenCashRamp} paymentType='deposit' address={smartAccountAddress} amount={amountDollar} reference={reference!} currency={countryFromRamp?.code!}/>}
        </>
        
      )
} 




/**

<div className='p-4 pb-0'>
                        <div className='flex w-full'>
                            <div className='grid gap-4 py-4'>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className='text-right font-semibold'>
                                        {country.currency}
                                    </Label>
                                    <Input 
                                        placeholder={rates?.depositRate!}
                                        value={amountLocal!}
                                        onChange={handleLocalChange} 
                                        className='text-xl font-semibold col-span-3' 
                                    />
                                </div>
                                <div className='grid grid-cols-4 items-center gap-4'>
                                    <Label className='text-right font-semibold'>
                                        USD
                                    </Label>
                                    <Input  
                                        placeholder='1.000000'
                                        value={amountDollar!}
                                        onChange={handleDollarChange}
                                        className='text-xl font-semibold col-span-3'
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center justify-between space-x-2'>
                            <Button
                                variant='outline'
                                size='icon'
                                className='h-8 w-8 shrink-0 rounded-full'
                            >
                                <MinusIcon className='h-4 w-4' />
                                <span className='sr-only'>Decrease</span>
                            </Button>
                            <Button
                                variant='outline'
                                size='icon'
                                className='h-8 w-8 shrink-0 rounded-full'
                            >
                                <PlusIcon className='h-4 w-4' />
                                <span className='sr-only'>Increase</span>
                            </Button>
                        </div>
                    </div>

 */