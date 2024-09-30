import { Pooler, useGetPooler } from "@/hooks/pooler/useGetPooler"
import { SusuClubOnchainRef } from "@/utils/constants/addresses"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { baseSepolia } from "viem/chains"
import { useBlockNumber, useReadContract } from "wagmi"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { Terminal } from "lucide-react"
import { Button } from "../ui/button"
import { motion } from "framer-motion"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { claimInviteReward } from "@/utils/refs/claimInviteReward"
import { Transaction, useGetTransactions } from "@/hooks/transactions/useGetTransactions"
import { getPoolerAction } from "@/actions/pooler/getPoolerAction"
import { getTransactionsAction } from "@/actions/transactions/getTransactionsAction"
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui/table"
import { publicClientTest } from "@/utils/client"

interface ClaimedProps {
    pooler: Pooler
    invited: `0x${string}`[]
}
interface InvitedData {
    pooler: string | null
    status: string | null
    rewarded: boolean | null
    invited: `0x${string}`
}

export function Claimed({ pooler, invited }: ClaimedProps) {

    
    
    const [laoding, setLoading] = useState<boolean>(false)
    // State for the current page number
 

    // get list of addresses invtes
    // make new interface to store:
    //1 ens
    //2 deposits
    //3 withdrals
    //4 claimed or not

    const { data: blockNumber } = useBlockNumber({ watch: true });
    const [invitedData, setInvitedData] = useState<InvitedData[]>([]);
    const [readyClaims, setReadyClaims] = useState<`0x${string}`[]>([]); // Array to store invited details

    useEffect(() => {
        const fetchInvitedData = async () => {
            const data = await Promise.all(invited.map(async (invited) => {
                const pooler = await getPoolerAction(invited);
                const transactions = await getTransactionsAction(invited);

                let firstDeposit: Transaction | undefined = undefined;
                let deposited: boolean | null = null;
                let withdrawn: boolean | null = null;
                let cooldown: boolean | null = null;
                let cooldownTimer: number | null = null;
                let status: string | null = null;
                let rewarded: boolean | null = null;

                if (transactions?.length! >= 1) {
                    const reversedTransactions = [...transactions!].reverse();
                    firstDeposit = reversedTransactions.find(transaction =>
                        transaction.txOf === "deposit" &&
                        parseFloat(transaction.amount) >= 2
                    );

                    if (firstDeposit) {
                        deposited = true
                        //status = "deposited"
                    } else {
                        deposited = false
                        status = "😭 no qualifying deposits"
                    }

                    const initWithdraw = reversedTransactions.find(transaction =>
                        transaction.txOf === "withdraw"
                    );

                    if (!initWithdraw) {
                        withdrawn = false;
                        //status = "cooldown mode active"
                    } else if (firstDeposit) {
                        const dateDeposit = new Date(firstDeposit.createdAt);
                        const dateWithdraw = new Date(initWithdraw.createdAt);

                        const differenceInMs = dateWithdraw.getTime() - dateDeposit.getTime();

                        if (differenceInMs >= 129600000) {
                            withdrawn = false;
                            //status = "cooldown mode active"
                        } else {
                            withdrawn = true;
                            status = "🥶 cooldown failed"
                        }
                    }

                    if (firstDeposit && !withdrawn) {
                        const dateDeposit = new Date(firstDeposit.createdAt);
                        const dateNow = new Date();
                        const differenceInMs = dateNow.getTime() - dateDeposit.getTime();
                        cooldownTimer = 129600000 - differenceInMs;

                        if (differenceInMs >= 129600000) {
                            cooldown = true;
                            status = "❄️ cooldown mode active"
                        } else {
                            cooldown = false;
                            status = "🧊🫠 cooldown passed"
                        }
                    }
                    const data = await publicClientTest.readContract({
                        address: SusuClubOnchainRef,
                        abi: [
                            {
                                "inputs": [
                                    {
                                        "internalType": "address",
                                        "name": "",
                                        "type": "address"
                                    }
                                ],
                                "name": "inviteRewarded",
                                "outputs": [
                                    {
                                        "internalType": "bool",
                                        "name": "",
                                        "type": "bool"
                                    }
                                ],
                                "stateMutability": "view",
                                "type": "function"
                            },
                        ],
                        functionName: 'inviteRewarded',
                        args: [(invited)]
                    })
                    rewarded = data
                } else {
                    status = "🫙 no deposits"
                }

                return {
                    pooler: pooler?.ens || invited,
                    status: status,
                    rewarded,
                    invited: invited
                  
                };
            }));

            setInvitedData(data);
        };

        fetchInvitedData();
    }, [invited, blockNumber]);

    useEffect(()=>{
        const filteredData = invitedData.filter(item => item.status === "🧊🫠 cooldown passed" && item.rewarded === false);
        const invitedAddresses = filteredData.map(item => item.invited);
        setReadyClaims(invitedAddresses)
    }, [invitedData])
    console.log("ready claims", readyClaims)


    const claimInviteBonus = () => {
        setLoading(true)
        const res = claimInviteReward(readyClaims)
        setLoading(false)
    }

    

    return (
        <>
            <div className="flex flex-col gap-16 w-[26rem]">
                <Alert className="w-[26rem]">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Hi 👋🏄 <span className="italic font-semibold">{pooler?.ens}</span>.susu.box</AlertTitle>
                    <AlertDescription>
                        🥳 You have entered the invite game🕹️. Tell your friend to get fill their Susu Box & get rewarded 🌊🏆
                    </AlertDescription>
                </Alert>
                <div className="flex flex-col w-full items-center gap-16">
                    <p className="font-bold">Click below to claim available invite rewards</p>
                    <div className="flex">
                        <span className="text-xl max-md:text-base text-gray-700">$</span>
                        <p className="text-8xl">2</p>
                    </div>
                    
                    <Button className="w-full" 
                        onClick={claimInviteBonus}                        
                    >
                    {
                        laoding
                        ? (
                            <>
                                <motion.div
                                initial={{ rotate: 0 }} // Initial rotation value (0 degrees)
                                animate={{ rotate: 360 }} // Final rotation value (360 degrees)
                                transition={{
                                    duration: 1, // Animation duration in seconds
                                    repeat: Infinity, // Infinity will make it rotate indefinitely
                                    ease: "linear", // Animation easing function (linear makes it constant speed)
                                }}
                            >
                                    <DotsHorizontalIcon/>
                                </motion.div>
                            </>
                        )
                        : (
                            <>
                                Get Invite Rewards 🎉
                            </>
                        )
                    }
                    </Button>
                </div>
                <div>
                <Table>
                    <TableCaption>A list of your recent invites and their status.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Invitee</TableHead>
                            <TableHead>Status</TableHead>
                            
                            <TableHead className="text-right">Rewarded</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invitedData.map((invitee: InvitedData) => (
                        <TableRow key={invitee.pooler}>
                            <TableCell className="font-medium">{invitee.pooler}</TableCell>
                            <TableCell>{invitee.status}</TableCell>
                            <TableCell className="text-right">{invitee.rewarded}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                        </TableRow>
                    </TableFooter>
                </Table>
                </div>
            </div>
        </>
    )
}