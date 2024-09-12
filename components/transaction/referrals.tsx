import { Button } from "../ui/button";
import { PlusIcon, PersonIcon } from "@radix-ui/react-icons"
import { CheckCircle, Copy } from "lucide-react"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Pooler } from "@/hooks/pooler/useGetPooler";
import { useState } from "react";


interface ReferralsProp {
    pooler: Pooler
}


export function Referrals ({ pooler } : ReferralsProp) {

    
    const [copied, setCopied] = useState<boolean>(false)
    
    const handleCopy = async () => {
        const clipboardText = await navigator.clipboard.writeText(`susu.club/${pooler.ens}`);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <>
            <div className="flex">        
                <Drawer>
                    <DrawerTrigger>
                        <Button>
                            <div className="flex">
                                <PersonIcon/>
                                <PlusIcon/>
                            </div>
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                            <DrawerTitle>Invite</DrawerTitle>
                            <DrawerDescription>Tell your friend about susu.club & when they deposit you may get rewarded. 😉</DrawerDescription>
                        </DrawerHeader>
                        <div className="flex w-full flex-col p-4 pb-0 gap-3">
                            <div className="flex w-full">
                                <Alert>
                                    <AlertTitle>
                                        <div className="flex gap-3">
                                            <div className="flex">
                                                <PersonIcon/>
                                                <PlusIcon/>
                                            </div>
                                            <div className="flex w-full items-center justify-between">
                                                <span className="font-bold">
                                                    {`susu.club/${pooler.ens}`}
                                                </span>
                                                <div>
                                                {
                                                    copied 
                                                    ?
                                                    <>
                                                        <CheckCircle 
                                                            className="h-4 w-4 cursor-none"
                                                            //onClick={handleCopy}
                                                        />
                                                    </>
                                                    :
                                                    <>
                                                        <Copy 
                                                            className="h-4 w-4 cursor-pointer"
                                                            onClick={handleCopy}
                                                        />
                                                    </>
                                                }
                                                </div>
                                            </div>
                                        </div>
                                    </AlertTitle>
                                </Alert>
                            </div>
                            <div className="flex w-full">
                                {/** */}
                            </div>
                        </div>
                    </div>
                    </DrawerContent>
                </Drawer>
            </div>
        </>
    )
}