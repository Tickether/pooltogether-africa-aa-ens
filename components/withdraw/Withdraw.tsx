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
import { Wallet2 } from 'lucide-react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Pooler } from '@/hooks/pooler/useGetPooler'
import { useState } from 'react'
import { Countries, Country } from '@/utils/constants/countries'
import { encodeFunctionData, erc20Abi, parseUnits } from 'viem'
import { BiconomySmartAccountV2, PaymasterMode } from '@biconomy/account'

interface WithdrawProps {
    pooler: Pooler
    smartAccount: BiconomySmartAccountV2
}

export function Withdraw ({ pooler, smartAccount } : WithdrawProps) {
    
    const country : Country = ( Countries as any )[pooler.country]

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

    const calldata = amountDollar ? encodeFunctionData({
        abi: erc20Abi,
        functionName: 'transfer',
        args: [ ('0x9d7C4Ea7B93699EC0FE1b28776082E297A015734'), (parseUnits(amountDollar!, 6)) ]
    }) : '0xdEAD000000000000000042069420694206942069'

    const tx = {
        to: '0x11DC650f09138b3F569A75FB9abAC934A1C25e4d',
        data: calldata,
    };

    const withdrawFromAAtoLocal = async () => {
        // Send the transaction and get the transaction hash
        const userOpResponse = await smartAccount.sendTransaction(tx, {
            paymasterServiceData: {mode: PaymasterMode.SPONSORED},
        });
        const { transactionHash } = await userOpResponse.waitForTxHash();
        console.log("Transaction Hash", transactionHash);
        const userOpReceipt  = await userOpResponse.wait();
        if(userOpReceipt.success == 'true') { 
            console.log("UserOp receipt", userOpReceipt)
            console.log("Transaction receipt", userOpReceipt.receipt)
            toLocal()
        }
    }
    const toLocal = () => {
        //paystack transfer from balances to user prefered walet
        // send info to  db
    }
    


    return (
        <Drawer>
            <DrawerTrigger asChild>
                    <Button className='gap-2' variant='outline'>
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
                    <DrawerTitle>Withdraw</DrawerTitle>
                    <DrawerDescription>Withdraw your susu balance to cover your expenses.</DrawerDescription>
                </DrawerHeader>
                <div className='p-4 pb-0'>
                    <div className='flex w-full'>
                        <div className='grid gap-4 py-4'>
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
                            <div className='grid grid-cols-4 items-center gap-4'>
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
                        <Button>Submit</Button>
                    </DrawerClose>
                </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
      )
} 




