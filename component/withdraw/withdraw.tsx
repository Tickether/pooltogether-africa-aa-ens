import { Pooler } from '@/hooks/useGetPooler'

import styles from './Withdraw.module.css'

import { Countries, Country } from '@/utils/constants/countries'
//import { dropSusuPool } from '@/utils/viem/useDropSusuPool'
import { useState } from 'react'
import { encodeFunctionData, parseUnits } from 'viem'
import { erc20ABI, useAccount, useWaitForTransaction } from 'wagmi'

import { usePrepareSendUserOperation, useSendUserOperation } from '@zerodev/wagmi'


interface WithdrawProfileProps {
    pooler: Pooler
    setOpenWithdrawModal: (openDepositModal : boolean) => void
    onWithdrawClose: () => void
}
export default function Withdraw({pooler, setOpenWithdrawModal, onWithdrawClose} : WithdrawProfileProps) {
    const { address, isConnected } = useAccount()   
    const country : Country = ( Countries as any )[pooler.country]

    const [amountLocal, setAmountLocal] = useState<string | null>(null)
    const [amountDollar, setAmountDollar] = useState<string | null>(null)

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
            setAmountDollar(inputValue === ''? '' : String(dollarRate.toFixed(2)));
        }
    }
    const handleDollarChange = (e: any) => {
        // Allow only numbers and a maximum of two decimal places
        const regex = /^\d*\.?\d{0,2}$/;
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
                    close
                </div>
                <div >
                    <div>
                        <span>I have</span>
                        <div>
                            <span>USD</span>
                            <input
                                type="text" 
                                value={amountDollar!}
                                onChange={handleDollarChange}
                            />
                        </div>
                    </div>
                    <div  className={styles.saving}>
                        <span>I want</span>
                        <div>
                            <label>{country.code}</label>
                            <input 
                                type="text" 
                                value={amountLocal!}
                                onChange={handleLocalChange}
                            />
                        </div>
                    </div>
                    
                </div>
                <button disabled={ amountLocal == null || amountLocal == '' || Number(amountDollar) < 1 } onClick={doPayLocal}>Save to Susu</button>
            </div>
                
                
            </main>
        </>
    )
}

