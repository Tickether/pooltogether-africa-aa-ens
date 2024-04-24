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
import { usePostWithdraw } from '@/hooks/withdraw/usePostWithdraw'
import { useUpdateWithdraw } from '@/hooks/withdraw/useUpdateWithdraw'
import { Ramp } from '../ramp/Ramp'
import { useGetCountries } from '@/hooks/cashRamp/useGetCountries'
import { useGetRates } from '@/hooks/cashRamp/useGetRates'
import { withdraw } from '@/utils/withdraw/withdraw'
import { transfer } from '@/utils/withdraw/transfer'

interface WithdrawProps {
    pooler: Pooler
    smartAccount: BiconomySmartAccountV2
    smartAccountAddress : `0x${string}`
    getBackTransactions : () => void
}

export function Withdraw ({ pooler, smartAccount, smartAccountAddress, getBackTransactions } : WithdrawProps) {

    const { countries } = useGetCountries('api/getCountries', 'availableCountries')
    console.log(countries)
        
    

    const { loading, postWithdraw } = usePostWithdraw()
    const { updateWithdraw } = useUpdateWithdraw()
    
    const countryFromRamp = countries ? countries!.find(country => country.name === pooler.country) : {name: '', code: ''}
    const country : Country = ( Countries as any )[pooler.country]


    const { rates } = useGetRates('api/getRates', 'marketRate', countryFromRamp?.code!)
    console.log(rates)
    const [openRamp, setOpenRamp] = useState<boolean>(false)
    const [amountLocal, setAmountLocal] = useState<string>('')
    const [amountDollar, setAmountDollar] = useState<string>('')

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

    const withdrawFromPooltoCashRamp = async () => {
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
            postWithdraw( smartAccountAddress!, transactionHash!, '', amountDollar!, amountLocal!, country.currency, rates?.withdrawalRate!, 'pending' )
            getBackTransactions()
            console.log("UserOp receipt", userOpReceipt)
            console.log("Transaction receipt", userOpReceipt.receipt)
            toLocal(transactionHash!)
        }
    }
    const toLocal = (txn: string) => {
        //await req from CashRamp
        // send info to  db
        updateWithdraw(txn, '', 'success')

    }
    


    return (
        <>
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
                                        {country.currency}
                                    </Label>
                                    <Input 
                                        placeholder={rates?.withdrawalRate!}
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
                            <Button onClick={withdrawFromPooltoCashRamp}>Submit</Button>
                        </DrawerClose>
                    </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
            {openRamp && <Ramp setOpenRamp={setOpenRamp} paymentType='withdraw' address={smartAccountAddress} amount={amountDollar} reference='' currency={countryFromRamp?.code!} />}
        </>
      )
} 




