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
import { usePaystackPayment } from 'react-paystack'
import { usePostDeposit } from '@/hooks/deposit/usePostDeposit'
import { dripSusuPool } from '@/utils/deposit/useDripSusuPool'
import { parseUnits } from 'viem'
import { PaystackProps } from 'react-paystack/dist/types'
import { channel } from 'diagnostics_channel'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

interface DepositProps {
    pooler: Pooler
    smartAccountAddress : string
}

export function Deposit ({ pooler, smartAccountAddress } : DepositProps) {
    const { loading, postDeposit } = usePostDeposit()

    const country : Country = ( Countries as any )[pooler.country]
    console.log(country)

    const [amountLocal, setAmountLocal] = useState<string>('')
    const [amountDollar, setAmountDollar] = useState<string>('')

    const handleLocalChange = (e: any) => {
        // Allow only numbers and a maximum of two decimal places
        const regex = /^\d*\.?\d{0,2}$/;
        const inputValue = e.target.value;

        if (regex.test(inputValue) || inputValue === '') {
            setAmountLocal(inputValue === '' ? '' : inputValue);
            const dollarRate = parseFloat(inputValue) / parseFloat(country.$rate);
            setAmountDollar(inputValue === ''? '' : String(dollarRate.toFixed(6)));
        }
    }
    const handleDollarChange = (e: any) => {
        // Allow only numbers and a maximum of two decimal places
        const regex = /^\d*\.?\d{0,6}$/;
        const inputValue = e.target.value;

        if (regex.test(inputValue) || inputValue === '') {
            setAmountDollar(inputValue === '' ? '' : inputValue)
            const localRate = parseFloat(inputValue) * parseFloat(country.$rate)
            setAmountLocal(inputValue === ''? '' : String(localRate.toFixed(2)))
        }
    }

    const config : PaystackProps = {
        reference: `${country.code}-${(new Date()).getTime().toString()}`,
        email: pooler.email,
        amount: Number(amountLocal!) * 100, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
        firstname: pooler.first,
        lastname: pooler.last,
        currency: country.code,
        channels: ['card', 'mobile_money'],
    }
    const handleNewDeposit = async(ref: string) => {
        const amountParsed = parseUnits(amountDollar!, 6)
        const txnHash = await dripSusuPool(`0x${smartAccountAddress!.slice(2)}`, amountParsed!)
        //save offchain depo info
        if (txnHash) {
            await postDeposit( smartAccountAddress!, txnHash!, ref, amountDollar!, amountLocal!, country.code, country.$rate )
        }
    }
    interface referenceTypes {
        reference: string
    }
    const onSuccess = (reference: referenceTypes) => {
        // Implementation for whatever you want to do with reference and after success call.
        console.log('reference', reference);
       
        handleNewDeposit(reference.reference)
       
        console.log('bomb');
    };
      
    const onClose = () => {
        // implementation for whatever you want to do when the Paystack dialog closed.
        console.log('closed');
    };

    const initPaystackPayment = usePaystackPayment(config);

    const doLcalPay = () => {
        initPaystackPayment({onSuccess, onClose})
    }
    

    return (
        <Drawer>
            <DrawerTrigger asChild>
                    <Button className='gap-2' variant='outline'>
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
                    <DrawerTitle>Deposit</DrawerTitle>
                    <DrawerDescription>Hit your daily susu saving goal & deposit to boost rewards</DrawerDescription>
                </DrawerHeader>
                <div className='p-4 pb-0'>
                    <div className='flex w-full'>
                        <div className='grid gap-4 py-4'>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className='text-right font-semibold'>
                                    {country.code}
                                </Label>
                                <Input 
                                    placeholder={country.$rate}
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
                <DrawerFooter>
                    
                    <DrawerClose asChild>
                        <Button onClick={doLcalPay}>Submit</Button>
                    </DrawerClose>
                </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
      )
} 




