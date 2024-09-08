import Image from "next/image";
import { postCashrampEscrowAction } from "@/actions/withdraw/postCashrampEscrowAction";
import { usePoolWithdraw } from "@/hooks/withdraw/usePoolWithdraw";
import { useEffect } from "react";
import { Pooler } from "@/hooks/pooler/useGetPooler";
import { sendEmail } from "@/actions/mail/sendEmail";

interface RampProps {
    setOpenRamp: (openRamp : boolean) => void
    pooler: Pooler
    paymentType: string
    address: `0x${string}`
    reference: string
    balance: string
}

export function Ramp({ setOpenRamp, pooler, paymentType, address, reference, balance } : RampProps) {

    const { poolWithdraw } = usePoolWithdraw()

    async function checkTransactionConfirmation (paymentRequest: any, txnHash: string) {
        const intervalId = setInterval(async () => {
            try {
                console.log(paymentRequest, txnHash )
                const confirmEscrow = await postCashrampEscrowAction(paymentRequest, txnHash);
                console.log(confirmEscrow);
                
                if (confirmEscrow!.confirmTransaction) {
                    console.log("Transaction confirmed");
                    clearInterval(intervalId);
                }
                
            } catch (error) {
                console.error("Error confirming transaction:", error);
            }
        }, 6000); // 6 seconds
      
        setTimeout(() => {
            clearInterval(intervalId);
            console.log("Stopped checking after 360 seconds");
        }, 360000); // 360 seconds
    };
    async function makeSunbath (amount: string, destinationAddress: `0x${string}`, paymentRequest: any) {
        const txnHash = await poolWithdraw(amount, destinationAddress, address)
        if (txnHash) {
            await sendEmail(pooler.email, pooler.ens, Number(amount).toFixed(2), 'Cashramp')
        }
        if (txnHash) {
            console.log(txnHash)
            await checkTransactionConfirmation(paymentRequest, txnHash)
        }
        return
    }
    

    useEffect(() => {
        async function handleMessage(message: MessageEvent) {

            if (message.origin === "https://useaccrue.com") {
                const { event, payload } = message.data;
                if (event === "crypto.requested") {


                    const amountUsd = parseFloat(payload.amountCents) / 100;
                    const destinationAddress = payload.destinationAddress;
                    const paymentRequest = payload.paymentRequest;
                    console.log(amountUsd, destinationAddress, paymentRequest)
                    
                    // Here"s where you add your custom experience for sending the *exact* USD amount to Cashramp"s Escrow Address (destinationAddress)
                    if (parseFloat(balance) >= amountUsd ) {
                        makeSunbath(String(amountUsd), destinationAddress, paymentRequest)
                        return
                    } else {
                        setOpenRamp(false)
                        return
                    }
                    
                }
            }
        }
        window.addEventListener("message", handleMessage);
    
        return () => {
            // Remove the event listener
            window.removeEventListener("message", handleMessage);
        };
    }, []);
    
    return (
        <main className="fixed flex flex-col z-20 bg-gray-900/25 w-screen h-screen items-center justify-center top-0 left-0 right-0 bottom-0 backdrop-blur-[0.666px]">

            <div className="w-full h-full relative">
                <div
                    onClick={async()=>{
                        setOpenRamp(false)
                    }}
                    className="absolute cursor-pointer p-5 top-0 right-0"
                >
                    <Image
                        src="/close.svg" 
                        alt="close" 
                        width={20}
                        height={20}
                    />
                </div>
                <div className="h-full w-full">
                    <iframe
                        src={
                            `
                                https://useaccrue.com/hosted/ramp?key=CSHRMP-PUBK_mO86nNyK8gOwP5Ho&paymentType=${paymentType}&address=${address}&coin=USDC&network=BASE&reference=${reference}&isWalletContext=false
                            `
                        }
                        title="cashRamp"
                        className="w-full h-full"
                    ></iframe>
                </div>
            </div>

        </main>
    );
}
