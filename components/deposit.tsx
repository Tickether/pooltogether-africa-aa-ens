import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { DoubleArrowDownIcon } from "@radix-ui/react-icons"
import { CheckCircle, Copy, SkipBack, Terminal, Vault } from "lucide-react"
import { Pooler } from "@/hooks/pooler/useGetPooler"
import { useEffect, useState } from "react"
import { usePostDeposit } from "@/hooks/deposit/usePostDeposit"
import { formatUnits } from "viem"
import { Separator } from "./ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "./ui/switch"
import { useBalance, useBlockNumber } from "wagmi"
import { USDC } from "@/utils/constants/addresses"
import { usePoolDeposit } from "@/hooks/deposit/usePoolDeposit"
import { useQueryClient } from "@tanstack/react-query"
import { base } from "viem/chains"
import { createOnrampSession } from "@/actions/createStripeSession/createOnrampSession"
import { Ramp } from "./ramp"
import { StripeOnrampModal } from "./stripeRamp/StripeOnrampModal"


interface DepositProps {
    pooler: Pooler
    smartAccountAddress: `0x${string}`
}



export function Deposit ({ pooler, smartAccountAddress } : DepositProps) {

    const { postDeposit } = usePostDeposit()
    const { loading, poolDeposit } = usePoolDeposit()

    
    const [open, setOpen] = useState<boolean>(false)
    const [copied, setCopied] = useState<boolean>(false)
    const [showAddress, setShowAddress] = useState<boolean | null>()

    const [openCashRamp, setOpenCashRamp] = useState<boolean>(false)
    const [openStripeRamp, setOpenStripeRamp] = useState<boolean>(false)
    const [reference, setReference] = useState<string | null>(null)
    const [paymentService, setPaymentService] = useState<string | null>(null)
    const [client_secret, setClientSecret] = useState<string | null>(null)


    const queryClient = useQueryClient() 
    const { data: blockNumber } = useBlockNumber({ watch: true }) 

    const {data: balance, queryKey} = useBalance({
        address: `0x${smartAccountAddress?.slice(2)}`,
        token: USDC,
        chainId: base.id
    })

    useEffect(() => { 
        queryClient.invalidateQueries({ queryKey }) 
    }, [blockNumber, queryClient, queryKey]) 

    const formatedBalance = balance ? formatUnits(balance?.value!, balance?.decimals!) : "0"
 
    const handleCopy = async () => {
        const clipboardText = await navigator.clipboard.writeText(pooler.address);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);

    };
    const doCashRampPay = () => {
        setOpenCashRamp(true)
        const ref = `${smartAccountAddress}-${(new Date()).getTime().toString()}`
        setReference(ref)
        setOpen(false)
    }

    const doStripePay = async () => {
        const res = await createOnrampSession(smartAccountAddress!)
        console.log(res)
        console.log(res?.client_secret!)
        setClientSecret(res?.client_secret!)
        setOpenStripeRamp(true)
        setOpen(false)
    }

    return (
        <>
            <Drawer 
                open={open}
                onClose={()=>{
                    setOpen(false)
                    setPaymentService(null)
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
                            <DoubleArrowDownIcon/>
                            <Vault size={17}/>
                        </div>
                        <span>Deposit</span>
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                            {
                                !paymentService && (
                                    <>
                                        <DrawerTitle>Deposit</DrawerTitle>
                                        <DrawerDescription>Choose out of the options & deposit to boost rewards</DrawerDescription>
                                    </>
                                )
                            }  
                            {
                                paymentService == "direct" && (
                                    <>
                                        <DrawerTitle>Direct Deposit</DrawerTitle>
                                        <DrawerDescription>Transfer USDC on Base to deposit</DrawerDescription>
                                    </>
                                )
                            }   
                        </DrawerHeader>                    
                        {
                            !paymentService && (
                                <>
                                    <div className="flex flex-col p-4 pb-0">
                                        <div className="flex flex-col gap-3">
                                            <Button
                                                className="gap-2"
                                                onClick={()=>{
                                                    setPaymentService("direct")
                                                }}
                                            >
                                                <div className="flex items-center">
                                                    <DoubleArrowDownIcon/>
                                                    <Vault size={17}/>
                                                </div>
                                                <p>Direct Deposit</p>
                                            </Button>
                                        </div>
                                        <p className="text-center">or</p>
                                        <Separator orientation="horizontal" />
                                        <p className="text-center">third party exchanges</p>
                                        <div className="flex flex-col gap-3">
                                            <Button
                                                className="gap-2"
                                                onClick={doCashRampPay}
                                            >
                                                <div className="flex items-center">
                                                    <DoubleArrowDownIcon/>
                                                    <Vault size={17}/>
                                                </div>
                                                <p>Cashramp</p>
                                            </Button>
                                            <Button
                                                className="gap-2"
                                                onClick={doStripePay}
                                            >
                                                <div className="flex items-center">
                                                    <DoubleArrowDownIcon/>
                                                    <Vault size={17}/>
                                                </div>
                                                <p>Link by Stripe</p>
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )
                        }
                        {
                            paymentService == "direct" && (
                                <>
                                    <div className="flex flex-col p-4 pb-0">
                                        <span className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <span>Reveal Wallet Address</span>
                                            </div>
                                            <div>
                                                <Switch
                                                    checked={showAddress!}
                                                    onCheckedChange={()=>{
                                                        setShowAddress(!showAddress)
                                                    }}
                                                />
                                            </div>
                                        </span>
                                        <Alert>
                                            <Terminal className="h-4 w-4" />
                                            <AlertTitle className="font-bold">
                                                <div className="flex items-center justify-between">
                                                    
                                                    
                                                    {
                                                        !showAddress
                                                        ? <><p className="text-base">{pooler.ens}.susu.box</p></>
                                                        : <><p className="text-[12px] max-[360px]:text-[11px]">{pooler.address}</p></>
                                                    }
                                                    
                                                </div>
                                            </AlertTitle>
                                            <AlertDescription className="text-xs">
                                                
                                                <div className="flex items-center justify-between">
                                                    <p>Send USDC to this wallet. Do not close this window until magic deposit done.</p>
                                                    {
                                                        showAddress && (
                                                            copied 
                                                            ?
                                                                <>
                                                                    <CheckCircle 
                                                                        className="h-9 w-9 cursor-none"
                                                                        //onClick={handleCopy}
                                                                    />
                                                                </>
                                                            :
                                                                <>
                                                                    <Copy 
                                                                        className="h-9 w-9 cursor-pointer"
                                                                        onClick={handleCopy}
                                                                    />
                                                                </>
                                                        )
                                                    }
                                                </div>
                                            </AlertDescription>
                                        </Alert>

                                        <p className="text-center"></p>
                                    </div>
                                </>
                            )
                        }
                        {
                            paymentService == "stripe" && (
                                <>
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
                                <div className="flex items-center justify-center gap-2">
                                    <p className="text-center text-xs text-gray-500">Missing some magic deposits, no worries...</p>
                                    <Button
                                        disabled={loading! || parseFloat(formatedBalance) == 0}
                                        onClick={async()=>{
                                            const poolTxn = await poolDeposit(formatedBalance, smartAccountAddress!)
                                            await postDeposit(
                                                smartAccountAddress,
                                                smartAccountAddress,
                                                poolTxn!,
                                                formatedBalance,
                                                "deposit"
                                            )
                                        }}
                                    >
                                        click here
                                    </Button>
                                </div>
                                </>
                            )
                        }
                    </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
            {openCashRamp && <Ramp setOpenRamp={setOpenCashRamp} paymentType="deposit" address={smartAccountAddress} reference={reference!} />}
            
            {openStripeRamp && <StripeOnrampModal setOpenRamp={setOpenStripeRamp} client_secret={client_secret!} />}
        </>
        
    )
} 
