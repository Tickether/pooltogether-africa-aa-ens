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
import { BadgeCheck, BadgeDollarSign, Ban, ClipboardPen, Eraser, SkipBack, Wallet2 } from 'lucide-react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Pooler } from '@/hooks/pooler/useGetPooler'
import { useEffect, useState } from 'react'
import { Countries, Country } from '@/utils/constants/countries'
import { usePostWithdraw } from '@/hooks/withdraw/usePostWithdraw'
import { useUpdateWithdraw } from '@/hooks/withdraw/useUpdateWithdraw'
import { Ramp } from '../ramp/Ramp'
import { useGetCountries } from '@/hooks/cashRamp/useGetCountries'
import { useGetRates } from '@/hooks/cashRamp/useGetRates'
import { Separator } from '../ui/separator'
import { trimDecimals } from '@/utils/trim'
import { usePoolWithdraw } from '@/hooks/withdraw/usePoolWithdraw'
import { isAddress } from 'viem'
import { useEnsAddress } from 'wagmi'
import { normalize } from 'viem/ens'
import { mainnet } from 'viem/chains'
import { publicClientMainnet } from '@/utils/client'


interface WithdrawProps {
    pooler: Pooler
    //smartAccount: BiconomySmartAccountV2
    smartAccountAddress : `0x${string}`
    getBackTransactions : () => void
    balance: string
}

export function Withdraw ({ pooler, smartAccountAddress, getBackTransactions, balance } : WithdrawProps) {

    const { loading: loadingWithdraw, poolWithdraw } = usePoolWithdraw()
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
    const [receiverAddress, setReceiverAddress] = useState<string>('');
    const [receiverAddressResolved, setReceiverAddressResolved] = useState<string>('');
    const [valid, setValid] = useState<boolean | null>(null);
    
    const handlePaste = async () => {
        const clipboardText = await navigator.clipboard.readText();
        setReceiverAddress(clipboardText);
    };

    const handleClearInput = () => {
        setReceiverAddress('')
    }; 
  

    const checkAddress = async () => {
        if (!isAddress(receiverAddress)) {
            setValid(false)
            setReceiverAddressResolved('')
            const ensAddress = await publicClientMainnet.getEnsAddress({
                name: (receiverAddress),
            })
            if (isAddress(ensAddress!)) {
                setValid(true);
                setReceiverAddressResolved(ensAddress!)
            } 
        } else {
            setValid(true);
            setReceiverAddressResolved(receiverAddress)
        }
    }

    useEffect(()=>{
        checkAddress()
    },[receiverAddress])
    console.log(receiverAddressResolved)

    
    window.addEventListener("message", (message) => {
        if (message.origin === "https://useaccrue.com") {
            const { event, payload } = message.data;
            if (event === "crypto.requested") {
                const amountUsd = parseFloat(payload.amountCents) / 100;
                const destinationAddress = payload.destinationAddress;
                const paymentRequest = payload.paymentRequest;
                console.log(amountUsd, destinationAddress, paymentRequest)
                // Here's where you add your custom experience for sending the *exact* USD amount to Cashramp's Escrow Address (destinationAddress)
                if (parseFloat(balance) >= amountUsd ) {
                    poolWithdraw(String(amountUsd), destinationAddress, smartAccountAddress)
                } else {
                    setOpenCashRamp(false)
                    return
                }
                // You can request transaction confirmation here by providing the payment request global ID provided above as `paymentRequest`
            }
        }
    });
    

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
    const handleUSDChange = (e: any) => {
        // Allow only numbers and a maximum of two decimal places
        const regex = /^(0|[1-9]\d*)(\.\d{0,6})?$/;
        const inputValue = e.target.value;
        const numericValue = parseFloat(inputValue)
        const balanceValue = parseFloat(balance)

        if ((regex.test(inputValue) || inputValue === '') && (numericValue <= balanceValue || isNaN(numericValue)) ) {
            setAmountDollar(inputValue === '' ? '' : inputValue)
        }
    }
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
                                            onClick={()=>{
                                                const ref = `${country.currency}-${(new Date()).getTime().toString()}`
                                                setReference(ref)
                                                setOpenCashRamp(true)
                                                setOpen(false)
                                            }}
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
                                        <div className='grid w-full max-w-sm items-center gap-1.5'>
                                            <div className='flex justify-between'>
                                                <div className='flex items-center gap-1'>
                                                    {valid == false && <Ban className='text-red-500' />}
                                                    {valid == true && <BadgeCheck className='text-green-500'/>}
                                                    <Label htmlFor='address'>Enter your withdraw wallet</Label>
                                                </div>
                                                {
                                                    receiverAddress != '' 
                                                    ?<><Eraser onClick={handleClearInput} /> </>
                                                    :<><ClipboardPen onClick={handlePaste} /></>
                                                }
                                            </div>
                                            <div className='flex w-full max-w-sm items-center space-x-2'>
                                                <Input 
                                                    id='address'
                                                    value={receiverAddress}
                                                    disabled={loadingWithdraw}
                                                    className='text-[13px]'
                                                    onChange={(e) => {
                                                        try {
                                                          (e.target.value.length >= 1)
                                                          ? setReceiverAddress((e.target.value))
                                                          : setReceiverAddress((e.target.value))
                                                        } catch (error : any) {
                                                          console.log(error.message)
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className='grid w-full max-w-sm items-center gap-1.5'>
                                            <div className='flex justify-between'>
                                                <div className='flex items-center gap-1'>
                                                    {parseFloat(amountDollar) == 0 || amountDollar == '' ? <Ban className='text-red-500'/> : <BadgeCheck className='text-green-500'/>}
                                                    <Label htmlFor='amount'>Enter amount</Label>
                                                </div>
                                                
                                                <div className='flex gap-1'>
                                                    <BadgeDollarSign />
                                                    <p>{trimDecimals(balance)}</p>
                                                </div>
                                            </div>
                                            <div className='flex w-full max-w-sm items-center space-x-2'>
                                                <Input 
                                                    className='text-xs'
                                                    id='amount'
                                                    value={amountDollar}
                                                    disabled={loadingWithdraw}
                                                    onChange={handleUSDChange} 
                                                />
                                                
                                            </div>
                                        </div>
                                        <Button
                                            disabled={!valid || parseFloat(amountDollar) == 0 || amountDollar == '' || loadingWithdraw}
                                            onClick={async ()=>{
                                                await poolWithdraw(amountDollar, receiverAddressResolved as `0x${string}`, smartAccountAddress)
                                                setReceiverAddress('')
                                                setAmountDollar('')
                                            }}
                                        >
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
            {openCashRamp && <Ramp setOpenRamp={setOpenCashRamp} paymentType='withdrawal' address={smartAccountAddress} reference={reference!} currency={countryFromRamp?.code!} />}
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