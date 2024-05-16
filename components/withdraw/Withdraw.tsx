'use client'

import { DoubleArrowUpIcon, MinusIcon, PlusIcon } from '@radix-ui/react-icons' 
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
import { SkipBack, Wallet2 } from 'lucide-react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Pooler } from '@/hooks/pooler/useGetPooler'
import { useState } from 'react'
import { Countries, Country } from '@/utils/constants/countries'
import { usePostWithdraw } from '@/hooks/withdraw/usePostWithdraw'
import { useUpdateWithdraw } from '@/hooks/withdraw/useUpdateWithdraw'
import { Ramp } from '../ramp/Ramp'
import { useGetCountries } from '@/hooks/cashRamp/useGetCountries'
import { useGetRates } from '@/hooks/cashRamp/useGetRates'
import { Separator } from '../ui/separator'
import { trimDecimals } from '@/utils/trim'

interface WithdrawProps {
    pooler: Pooler
    //smartAccount: BiconomySmartAccountV2
    smartAccountAddress : `0x${string}`
    getBackTransactions : () => void
    balance: string
}

export function Withdraw ({ pooler, smartAccountAddress, getBackTransactions, balance } : WithdrawProps) {

    const { countries } = useGetCountries()
    console.log(countries)
        
    
    const [open, setOpen] = useState<boolean | null>()
    
    
    //const [reference, setReference] = useState<string | null>(null)
    const [paymentService, setPaymentService] = useState<string | null>(null)
    const { loading, postWithdraw } = usePostWithdraw()
    const { updateWithdraw } = useUpdateWithdraw()
    
    const countryFromRamp = countries ? countries!.find(country => country.name === pooler.country) : {name: '', code: ''}
    const country : Country = ( Countries as any )[pooler.country]


    const { rates } = useGetRates()
    console.log(rates)
    const [openCashRamp, setOpenCashRamp] = useState<boolean>(false)
    const [reference, setReference] = useState<string | null>(null)
    const [amountLocal, setAmountLocal] = useState<string>('')
    const [amountDollar, setAmountDollar] = useState<string>('')
    /*
    const handleLocalChange = (e: any) => {
        // Allow only numbers and a maximum of two decimal places
        const regex = /^\d*\.?\d{0,2}$/;
        const inputValue = e.target.value;

        if (regex.test(inputValue) || inputValue === '') {
            setAmountLocal(inputValue === '' ? '' : inputValue);
            const dollarRate = parseFloat(inputValue) / parseFloat(rates?.withdrawalRate!);
            setAmountDollar(inputValue === ''? '' : String(dollarRate.toFixed(6)));
        }
    }
    const handleDollarChange = (e: any) => {
        // Allow only numbers and a maximum of two decimal places
        const regex = /^\d*\.?\d{0,6}$/;
        const inputValue = e.target.value;
        if (regex.test(inputValue) || inputValue === '') {
            setAmountDollar(inputValue === '' ? '' : inputValue)
            const localRate = parseFloat(inputValue) * parseFloat(rates?.withdrawalRate!)
            setAmountLocal(inputValue === ''? '' : String(localRate.toFixed(2)))
        }
    }
    */
    const withdrawFromPooltoCashRamp = async () => {
        const ref = `${country.currency}-${(new Date()).getTime().toString()}`
        setReference(ref)
        //setOpenRamp(true)
        /*
        const amountParsed = parseUnits(amountDollar!, 6)

        
        let tx = []
        const tx1 = withdraw(amountParsed, smartAccountAddress)
        tx.push(tx1)
        const tx2 = transfer(smartAccountAddress, amountParsed)
        //replace address here with Cashramp EScrow
        tx.push(tx2)

        // Send the transaction and get the transaction hash
        const userOpResponse = await smartAccount.sendTransaction(tx, {
            paymasterServiceData: {mode: PaymasterMode.SPONSORED},
        });
        const { transactionHash } = await userOpResponse.waitForTxHash();
        console.log("Transaction Hash", transactionHash);
        const userOpReceipt  = await userOpResponse.wait();
        if(userOpReceipt.success == 'true') { 
            //postWithdraw( smartAccountAddress!, transactionHash!, '', amountDollar!, amountLocal!, country.currency, rates?.withdrawalRate!, 'pending' )
            //getBackTransactions()
            console.log("UserOp receipt", userOpReceipt)
            console.log("Transaction receipt", userOpReceipt.receipt)
            toLocal(transactionHash!)
        }
        */
    }
    const toLocal = (txn: string) => {
        //await req from CashRamp
        // send info to  db
        updateWithdraw(txn, '', 'success')

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
                            <DoubleArrowUpIcon/>
                            <Wallet2 size={16} />
                        </div>
                        <span className='max-md:hidden'>Withdraw</span>
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className='mx-auto w-full max-w-sm'>
                    <DrawerHeader>
                            {
                                !paymentService && (
                                    <>
                                        <DrawerTitle>Withdraw</DrawerTitle>
                                        <DrawerDescription>Choose withdraw option, cover your expenses.</DrawerDescription>
                                    </>
                                )
                            }  
                            {
                                paymentService == 'direct' && (
                                    <>
                                        <DrawerTitle>Direct Withdraw</DrawerTitle>
                                        <DrawerDescription>Withdraw USDC to any wallet on OP</DrawerDescription>
                                    </>
                                )
                            }   
                    </DrawerHeader>
                        {
                            !paymentService && (
                                <>
                                    <div className='flex flex-col p-4 pb-0'>
                                        <Button
                                            onClick={()=>{
                                                setPaymentService('direct')
                                            }}
                                        >
                                            <DoubleArrowUpIcon/>
                                            <Wallet2 size={16} />
                                            <p>Direct Withdraw</p>
                                        </Button>
                                        <p className='text-center'>or</p>
                                        <Separator orientation='horizontal' />
                                        <p className='text-center'>third party exchanges</p>
                                        <Button
                                            //onClick={doCashRampPay}
                                        >
                                            <DoubleArrowUpIcon/>
                                            <Wallet2 size={16} />
                                            <p>Cashramp</p>
                                        </Button>
                                    </div>
                                </>
                            )
                        }
                        {
                            paymentService == 'direct' && (
                                <>
                                    <div className='flex w-full flex-col gap-2 p-4 pb-0'>
                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor='address'>Enter your withdraw wallet</Label>
                                            <div className='flex w-full max-w-sm items-center space-x-2'>
                                                <Input id='address' />
                                                <Button type="submit">Paste</Button> 
                                            </div>
                                        </div>
                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor='amount'>Enter your withdraw amount</Label>
                                            <div className='flex w-full max-w-sm items-center space-x-2'>
                                                <Input id='amount' />
                                                <div>
                                                    <p>{trimDecimals(balance)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <Button>
                                            Withdraw
                                        </Button>
                                    </div>
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
                                </>
                            )
                        }
                        {
                            !paymentService && (
                                <>
                                    <Button
                                        onClick={()=>{
                                            setOpen(false)
                                        }}
                                        variant='outline'
                                    >
                                        Cancel
                                    </Button>
                                </>
                            )
                        }
                    </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
            {openCashRamp && <Ramp setOpenRamp={setOpenCashRamp} paymentType='withdrawal' address={smartAccountAddress} amount={amountDollar} reference={reference!} currency={countryFromRamp?.code!} />}
        </>
      )
} 




/**4
 * 
 * <div>
                                    <p className='text-center text-xs text-gray-500'>Missing some magic deposits, no worries, <Button
                                        disabled={loading!}
                                        onClick={()=>{
                                            //poolWitjdraw('0.05', smartAccountAddress!)
                                            //getBackTransactions()
                                        }}
                                    >click here</Button></p>
                                </div>
 */