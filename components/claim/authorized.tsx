import Image from "next/image";
import { Logout } from "../logout";
import { Button } from "../ui/button";
import { Landmark, Undo } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBiconomy } from "@/providers/BiconomyContext";
import { useBlockNumber, useReadContract } from "wagmi";
import { cashrampDepositFrom, SusuClubOnchainRef, USDC } from "@/utils/constants/addresses";
import { useEffect, useState } from "react";
import { baseSepolia } from "viem/chains";
import { useQueryClient } from "@tanstack/react-query";
import { Claimed } from "./claimed";
import { Unclaimed } from "./unclaimed";
import { useGetPooler } from "@/hooks/pooler/useGetPooler";
import { Transaction, useGetTransactions } from "@/hooks/transactions/useGetTransactions";

export function Authorized() {

    const router = useRouter()
    const { smartAccount, smartAccountAddress } = useBiconomy()
    const { pooler, loading, getBackPooler } = useGetPooler( smartAccountAddress! )
    const { transactions } = useGetTransactions( smartAccountAddress! )

    console.log(transactions)

    const [ firstDeposit, setFirstDeposit ] = useState<Transaction | null>(null)
    const [ deposited, setDepsosited ] = useState<boolean | null>(null)
    const [ withdrawn, setWithdrawn ] = useState<boolean | null>(null)
    const [ cooldown, setCooldown ] = useState<boolean | null>(null)
    const [ cooldownTimer, setCooldownTimer ] = useState<number | null>(null)

    const queryClient = useQueryClient()  
    const boostQueryClient = useQueryClient() 
    const { data: blockNumber } = useBlockNumber({ watch: true }) 

    const checkClaimable = () => {
        let initDeposit: Transaction | undefined
        let initWithdraw: Transaction | undefined
        // Reverse the transactions array to iterate from oldest to newest
        if (transactions?.length! >= 1) {
            const reversedTransactions = [...transactions!].reverse();
            initDeposit = reversedTransactions.find(transaction => 
                transaction.txOf === "deposit" && 
                transaction.target.toLocaleLowerCase() === cashrampDepositFrom.toLocaleLowerCase() && // "0xf29C9e5b3BD6F192EF709aC010A991BA4a291e9c"  &&
                parseFloat(transaction.amount) >= 2
            );
            if (initDeposit) {
                setFirstDeposit(initDeposit)
                setDepsosited(true)
            } else {
                setDepsosited(false)
            }
            initWithdraw = reversedTransactions.find(transaction => 
                transaction.txOf === "withdraw" 
            );
            if (!initWithdraw) {
                setWithdrawn(false)
            }
            if (initWithdraw && initDeposit) {  
                console.log(initDeposit.createdAt)
                console.log(initWithdraw.createdAt)
                const dateDeposit = new Date(initDeposit.createdAt);
                const dateWithdraw = new Date(initWithdraw.createdAt);
                console.log(dateDeposit)
                console.log(dateWithdraw)
                // Calculate the difference in milliseconds
                const differenceInMs = dateWithdraw.getTime() - dateDeposit.getTime();
                console.log(differenceInMs)
                if (differenceInMs >= 129600000) {
                    setWithdrawn(false)
                    //setCooldown(true)
                    console.log("It has been 36 hours or more since dateWithdraw.");
                } else {
                    console.log("It has been less than 36 hours since dateWithdraw.");
                    setWithdrawn(true)
                    //setCooldown(false)
                }
            }
        }
    }
    console.log(deposited)
    useEffect(()=>{
        checkClaimable()
    }, [transactions])

    const checkCooldown = () => {
        if (firstDeposit) {
            const dateDeposit = new Date(firstDeposit.createdAt);
            const dateNow = new Date()
            console.log(dateDeposit)
            console.log(dateNow)
            // Calculate the difference in milliseconds
            const differenceInMs = dateNow.getTime() - dateDeposit.getTime();
            console.log(differenceInMs)
            const cooldownTimeMs = 129600000 - differenceInMs;
            setCooldownTimer(cooldownTimeMs)
            
            if (differenceInMs >= 129600000) {
                setCooldown(true)
                console.log("It has been 36 hours after dateDeposit");
            } else {
                console.log("It has been less than 36 hours since dateDeposit.");
                setCooldown(false)
            }
        }
    }
    useEffect(()=>{
        checkCooldown()
    }, [blockNumber])

    
    const {data: memberRewarded, queryKey} = useReadContract({
        abi: [
            {
				"inputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"name": "memberRewarded",
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
        address: SusuClubOnchainRef,
        functionName: "memberRewarded",
        args: [(smartAccountAddress! as `0x${string}`)],
        chainId: baseSepolia.id
    })
    useEffect(() => { 
        queryClient.invalidateQueries({ queryKey }) 
    }, [blockNumber, queryClient, queryKey]) 
    console.log(memberRewarded)



    const {data: getInvitesClaimedFrom, queryKey: boostQueryKey } = useReadContract({
        abi: [
            {
				"inputs": [
					{
						"internalType": "address",
						"name": "referrer",
						"type": "address"
					}
				],
				"name": "getInvitesClaimedFrom",
				"outputs": [
					{
						"internalType": "address[]",
						"name": "",
						"type": "address[]"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
        ],
        address: SusuClubOnchainRef,
        functionName: "getInvitesClaimedFrom",
        args: [(smartAccountAddress! as `0x${string}`)],
        chainId: baseSepolia.id
    })
    useEffect(() => { 
        boostQueryClient.invalidateQueries({ queryKey: boostQueryKey  }) 
    }, [blockNumber, boostQueryClient, queryKey]) 
    console.log(getInvitesClaimedFrom)



    return (
        <>
            <main className="flex min-h-screen flex-col items-center gap-8 p-24 max-md:p-6 bg-white">
                <div className="flex w-full items-center justify-between">
                    <div className="flex">
                        <Image
                            src=""
                            alt=""
                            width={0}
                            height={0}
                        />
                        <p className="text-3xl font-bold">susu club</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            className="gap-2" 
                            onClick={()=>{
                                router.push("/susu")
                            }}
                        >
                            <div className="flex items-center">
                                <Landmark className="h-4 w-4"/>
                                <Undo className="h-4 w-4"/>
                            </div>
                            <span className="max-md:hidden">Back to Susu Box</span>
                        </Button>
                        <Logout/>
                    </div>
                </div>
                <div className="flex w-full items-center justify-center">
                    {
                        //member bonus not claimed
                        smartAccountAddress && pooler && memberRewarded == false && (
                            <><Unclaimed pooler={pooler!} deposited={deposited} withdrawn={withdrawn} cooldown={cooldown} cooldownTimer={cooldownTimer}/></>
                        )
                    }
                    {
                        //vs
                        smartAccountAddress && pooler && memberRewarded == undefined && (
                            <>loading</>
                        )
                    }
                    {
                        //member bonus claimed
                        smartAccountAddress && pooler && memberRewarded == true && (
                            <><Claimed pooler={pooler} invited={getInvitesClaimedFrom! as `0x${string}`[]} /></>
                        )
                    }
                </div>
            </main>
        </>
    )   
}