import { useEffect, useState } from "react";
import { DoubleArrowUpIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { BadgeCheck, BadgeDollarSign, Ban, ClipboardPen, Eraser, SkipBack, Wallet2 } from "lucide-react"
import { Pooler } from "@/hooks/pooler/useGetPooler";
import { trimDecimals } from "@/utils/trim";
import { isAddress } from "viem";
import { publicClientMainnet } from "@/utils/client";
import { usePoolWithdraw } from "@/hooks/withdraw/usePoolWithdraw";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Ramp } from "./ramp";
import { sendEmail } from "@/actions/mail/sendEmail";



interface WithdrawProps {
    pooler: Pooler
    smartAccountAddress : `0x${string}`
    balance: string
}

export function Withdraw ({ pooler, smartAccountAddress, balance } : WithdrawProps) {

    const { loading: loadingWithdraw, poolWithdraw } = usePoolWithdraw()
    
    const [open, setOpen] = useState<boolean>(false)
    
    
    //const [reference, setReference] = useState<string | null>(null)
    const [paymentService, setPaymentService] = useState<string | null>(null)
    //const { loading, postWithdraw } = usePostWithdraw()


    const [openCashRamp, setOpenCashRamp] = useState<boolean>(false)
    const [reference, setReference] = useState<string | null>(null)
    const [amountDollar, setAmountDollar] = useState<string>("")
    const [receiverAddress, setReceiverAddress] = useState<string>("");
    const [receiverAddressResolved, setReceiverAddressResolved] = useState<string>("");
    const [valid, setValid] = useState<boolean | null>(null);
    
    const handlePaste = async () => {
        const clipboardText = await navigator.clipboard.readText();
        setReceiverAddress(clipboardText);
    };

    const handleClearInput = () => {
        setReceiverAddress("")
    }; 
  
    const handleUSDChange = (e: any) => {
        // Allow only numbers and a maximum of two decimal places
        const regex = /^(0|[1-9]\d*)(\.\d{0,6})?$/;
        const inputValue = e.target.value;
        const numericValue = parseFloat(inputValue)
        const balanceValue = parseFloat(balance)

        if ((regex.test(inputValue) || inputValue === "") && (numericValue <= balanceValue || isNaN(numericValue)) ) {
            setAmountDollar(inputValue === "" ? "" : inputValue)
        }
    }

    

    useEffect(()=>{
        const checkAddress = async () => {
            if (!isAddress(receiverAddress)) {
                setValid(false)
                setReceiverAddressResolved("")
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
        checkAddress()
    },[ receiverAddress ])
    console.log(receiverAddressResolved)
    
    

    return (
        <>
            <Drawer 
                open={open}
                onClose={()=>{
                    setOpen(false)
                    setPaymentService(null)
                    setReceiverAddress("")
                    setAmountDollar("")
                }}
            >
                <DrawerTrigger asChild>
                    <Button 
                        className="gap-2" 
                        variant="outline"
                        onClick={()=>{
                            setOpen(true)
                        }}
                    >
                        <div className="flex items-center">
                            <DoubleArrowUpIcon/>
                            <Wallet2 size={16} />
                        </div>
                        <span className="max-md:hidden">Withdraw</span>
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
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
                                paymentService == "direct" && (
                                    <>
                                        <DrawerTitle>Direct Withdraw</DrawerTitle>
                                        <DrawerDescription>Withdraw USDC to any wallet on Base</DrawerDescription>
                                    </>
                                )
                            }   
                    </DrawerHeader>
                        {
                            !paymentService && (
                                <>
                                    <div className="flex flex-col p-4 pb-0">
                                        <Button
                                            className="gap-2"
                                            onClick={()=>{
                                                setPaymentService("direct")
                                            }}
                                        >
                                            <div className="flex items-center">
                                                <DoubleArrowUpIcon/>
                                                <Wallet2 size={16} />
                                            </div>
                                            <p>Direct Withdraw</p>
                                        </Button>
                                        <p className="text-center">or</p>
                                        <Separator orientation="horizontal" />
                                        <p className="text-center">third party exchanges</p>
                                        <Button
                                            className="gap-2"
                                            onClick={()=>{
                                                const ref = `${smartAccountAddress}-${(new Date()).getTime().toString()}`
                                                setReference(ref)
                                                setOpenCashRamp(true)
                                                setOpen(false)
                                            }}
                                        >
                                            <div className="flex items-center">
                                                <DoubleArrowUpIcon/>
                                                <Wallet2 size={16} />
                                            </div>
                                            
                                            <p>Cashramp</p>
                                        </Button>
                                    </div>
                                </>
                            )
                        }
                        {
                            paymentService == "direct" && (
                                <>
                                    <div className="flex w-full flex-col gap-2 p-4 pb-0">
                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <div className="flex justify-between">
                                                <div className="flex items-center gap-1">
                                                    {valid == false && <Ban className="text-red-500" />}
                                                    {valid == true && <BadgeCheck className="text-green-500"/>}
                                                    <Label htmlFor="address">Enter your withdraw wallet</Label>
                                                </div>
                                                {
                                                    receiverAddress != "" 
                                                    ?<><Eraser onClick={handleClearInput} /> </>
                                                    :<><ClipboardPen onClick={handlePaste} /></>
                                                }
                                            </div>
                                            <div className="flex w-full max-w-sm items-center space-x-2">
                                                <Input 
                                                    id="address"
                                                    value={receiverAddress}
                                                    disabled={loadingWithdraw}
                                                    className="text-[13px]"
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
                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <div className="flex justify-between">
                                                <div className="flex items-center gap-1">
                                                    {parseFloat(amountDollar) == 0 || amountDollar == "" ? <Ban className="text-red-500"/> : <BadgeCheck className="text-green-500"/>}
                                                    <Label htmlFor="amount">Enter amount</Label>
                                                </div>
                                                
                                                <div className="flex gap-1">
                                                    <BadgeDollarSign />
                                                    <p>{trimDecimals(balance)}</p>
                                                </div>
                                            </div>
                                            <div className="flex w-full max-w-sm items-center space-x-2">
                                                <Input 
                                                    className="text-xs"
                                                    id="amount"
                                                    value={amountDollar}
                                                    disabled={loadingWithdraw}
                                                    onChange={handleUSDChange} 
                                                />
                                                
                                            </div>
                                        </div>
                                        <Button
                                            disabled={!valid || parseFloat(amountDollar) == 0 || amountDollar == "" || loadingWithdraw}
                                            onClick={async ()=>{
                                                await poolWithdraw(amountDollar, receiverAddressResolved as `0x${string}`, smartAccountAddress)
                                                await sendEmail(pooler.email, pooler.ens, Number(amountDollar).toFixed(2), 'direct withdrawal to a wallet of your choice')
                                                setReceiverAddress("")
                                                setAmountDollar("")
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
                            paymentService == "direct" && (
                                <>
                                    <Button
                                        variant="outline"
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
                    </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
            {openCashRamp && <Ramp setOpenRamp={setOpenCashRamp} pooler={pooler} paymentType="withdrawal" address={smartAccountAddress} reference={reference!} balance={balance} />}
        </>
      )
} 
