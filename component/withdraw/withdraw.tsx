import { Pooler } from '@/hooks/useGetPooler'

import styles from './Withdraw.module.css'

import { Countries, Country } from '@/utils/constants/countries'
//import { dropSusuPool } from '@/utils/viem/useDropSusuPool'
import { useState } from 'react'
import { encodeFunctionData, parseUnits } from 'viem'
import { erc20ABI, useAccount, useWaitForTransaction } from 'wagmi'

import { usePrepareSendUserOperation, useSendUserOperation } from '@zerodev/wagmi'
import Image from 'next/image'


interface WithdrawProfileProps {
    pooler: Pooler
    setOpenWithdrawModal: (openDepositModal : boolean) => void
    onWithdrawClose: () => void
}
export default function Withdraw({pooler, setOpenWithdrawModal, onWithdrawClose} : WithdrawProfileProps) {
    const { address, isConnected } = useAccount()   
    const country : Country = ( Countries as any )[pooler.country]

    const [amountLocal, setAmountLocal] = useState<string>('')
    const [amountDollar, setAmountDollar] = useState<string>('')

    const calldata = amountDollar ? encodeFunctionData({
        abi: erc20ABI,
        functionName: 'transfer',
        args: [ ('0x9d7C4Ea7B93699EC0FE1b28776082E297A015734'), (parseUnits(amountDollar!, 6)) ]
    }) : '0xdEAD000000000000000042069420694206942069'
    
    
      // Prepare the tx
    const { config, error } = usePrepareSendUserOperation({
        to: '0xc3d6a8d76B304E0716b3227C00a83187340DC846',
        data: calldata,
        value: 0,
    })
    console.log(config)
    const { sendUserOperation, data } = useSendUserOperation(config);
    console.log(data)
    // Wait on the status of the tx
    useWaitForTransaction({
        hash: data?.hash,
        enabled: !!data,
        onSuccess(data) {
            console.log("Transaction was successful.")
        }
    })

    const doPayLocal = async() => {
        sendUserOperation!()
        //send local to destination wallet
    }

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

    


    return(
        <>
            <main className={styles.main}>
            <div className={styles.wrapper}>
                <div onClick={() => setOpenWithdrawModal(false)} className={styles.close}>
                    <Image 
                        src='close.svg' 
                        alt='' 
                        width={36}
                        height={36}
                    />
                </div>
                <div className={styles.modal}>
                    <div className={styles.dex}>
                        <div className={styles.swap}>
                            <span>I have</span>
                            <div className={styles.input}>
                                <input
                                    type="text" 
                                    placeholder='1.0000000'
                                    value={amountDollar!}
                                    onChange={handleDollarChange}
                                />
                                <label>USD</label>
                            </div>
                        </div>
                        <div className={styles.swap}>
                            <span>I want</span>
                            <div className={styles.input}>
                                <input 
                                    type="text" 
                                    placeholder={country.$rate}
                                    value={amountLocal!}
                                    onChange={handleLocalChange}
                                />
                                <label>{country.code}</label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button disabled={ amountLocal == null || amountLocal == '' || Number(amountDollar) < 1 } onClick={doPayLocal}>Withdraw from Susu</button>
                    </div>
                </div>
                
            </div>
                
                
            </main>
        </>
    )
}

