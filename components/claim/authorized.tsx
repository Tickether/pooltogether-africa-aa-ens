import Image from "next/image";
import { Logout } from "../logout";
import { Button } from "../ui/button";
import { Landmark, Undo } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBiconomy } from "@/providers/BiconomyContext";
import { useBlockNumber, useReadContract } from "wagmi";
import { SusuClubOnchainRef } from "@/utils/constants/addresses";
import { useEffect, useState } from "react";
import { baseSepolia } from "viem/chains";
import { useQueryClient } from "@tanstack/react-query";
import { Claimed } from "./claimed";
import { Unclaimed } from "./unclaimed";

export function Authorized() {

    const router = useRouter()
    const { smartAccount, smartAccountAddress } = useBiconomy()


    const queryClient = useQueryClient()  
    const { data: blockNumber } = useBlockNumber({ watch: true }) 
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
                <div>
                    {
                        //member bonus not claimed
                        memberRewarded == false && (
                            <><Unclaimed/></>
                        )
                    }
                    {
                        //vs
                        memberRewarded == undefined && (
                            <>loading</>
                        )
                    }
                    {
                        //member bonus claimed
                        memberRewarded == true && (
                            <><Claimed/></>
                        )
                    }
                </div>
            </main>
        </>
    )   
}