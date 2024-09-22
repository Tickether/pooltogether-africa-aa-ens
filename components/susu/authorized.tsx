"use client";

import { useBiconomy } from "@/providers/BiconomyContext"
import { useRouter } from "next/navigation";
import { useGetPooler } from "@/hooks/pooler/useGetPooler";
import { useGetTransactions } from "@/hooks/transactions/useGetTransactions";
import Image from "next/image";
import { Logout } from "../logout";
import { Profile } from "./profile";
import { Withdraw } from "./withdraw";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Terminal } from "lucide-react";
import { formatUnits } from "viem";
import { suPrzUSDC, TWAB } from "@/utils/constants/addresses";
import { useEffect } from "react";
import { useBalance, useBlockNumber, useReadContract } from "wagmi";
import { base } from "viem/chains";
import { useQueryClient } from "@tanstack/react-query";
import { twabControllerABI } from "@generationsoftware/hyperstructure-client-js";
import { Deposit } from "./deposit";
import { Balances } from "./balances";
import { Transactions } from "./transaction/transactions";



export function Authorized() {
    const router = useRouter() 
    const { smartAccount, smartAccountAddress } = useBiconomy()
    const { pooler, loading, getBackPooler } = useGetPooler( smartAccountAddress! )
    const { transactions } = useGetTransactions( smartAccountAddress! )


    const queryClient = useQueryClient() 
    const boostQueryClient = useQueryClient() 
    const { data: blockNumber } = useBlockNumber({ watch: true }) 

    const {data: balance, queryKey} = useBalance({
        address: `0x${smartAccountAddress?.slice(2)}`,
        token: suPrzUSDC,
        chainId: base.id
    })
    useEffect(() => { 
        queryClient.invalidateQueries({ queryKey }) 
    }, [blockNumber, queryClient, queryKey]) 
    const formatedBalance = balance ? formatUnits(balance?.value!, balance?.decimals!) : "0"



    const {data: boostBalance, queryKey: boostQueryKey} = useReadContract({
        abi: twabControllerABI,
        address: TWAB,
        functionName: "delegateBalanceOf",
        args: [(suPrzUSDC), (smartAccountAddress! as `0x${string}`)]
    })
    useEffect(() => { 
        boostQueryClient.invalidateQueries({ queryKey: boostQueryKey }) 
    }, [blockNumber, boostQueryClient, boostQueryKey]) 
    
    const boostedtBalance = boostBalance && typeof boostBalance === "bigint" 
    ? boostBalance - (balance?.value !== undefined ? BigInt(balance.value) : BigInt(0)) 
    : BigInt(0);

    const formatedBoostBalance = boostedtBalance ? formatUnits(boostedtBalance, balance?.decimals!) : "0";
    
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
                        {
                            pooler && (
                                <Withdraw pooler={pooler!} smartAccountAddress={smartAccountAddress! as `0x${string}`} balance={formatedBalance!}/>
                            )
                        }
                        <Profile pooler={pooler} smartAccountAddress={smartAccountAddress!} getBackPooler={getBackPooler}/>
                        <Logout/>
                    </div>
                </div>
                <div className="flex w-full items-center justify-center">
                    {
                        !pooler && loading
                        && (
                            <>
                                <p>loading...</p>
                            </>
                        )
                    }
                    {
                        !pooler && !loading
                        && (
                            <>
                                <Alert className="w-108">
                                    <Terminal className="h-4 w-4" />
                                    <AlertTitle>Create a Profile!</AlertTitle>
                                    <AlertDescription>
                                        ⚠️Setup your profile & make deposits🚧
                                    </AlertDescription>
                                </Alert>
                            </>
                        )
                    }
                    {
                        pooler && !loading
                        && (
                            <>
                                <Alert className="w-108">
                                    <Terminal className="h-4 w-4" />
                                    <AlertTitle>Hi 👋🏄 <span className="italic font-semibold">{pooler?.ens}</span>.susu.box</AlertTitle>
                                    <AlertDescription>
                                        🥳 You are ready to make deposits. Happy Pooling 🙌🏊
                                    </AlertDescription>
                                </Alert>
                                <h2></h2> 
                            </>
                        )
                    }
                </div>
                <div>
                    {/** Balances */}
                    {
                        smartAccountAddress && pooler && !loading && <Balances balance={formatedBalance!} boostBalance={formatedBoostBalance}/>
                    }
                </div>
                { smartAccountAddress && pooler && !loading && <Deposit pooler={pooler!} smartAccountAddress={smartAccountAddress! as `0x${string}`}/>  }
                <div className="flex w-full items-center justify-center">
                    { smartAccount && pooler && !loading && <Transactions transactions={transactions!} pooler={pooler}/>}
                </div>
            </main>    
        </>
    )
}