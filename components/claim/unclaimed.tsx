import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Pooler } from "@/hooks/pooler/useGetPooler";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useWriteContract } from "wagmi";
import { baseSepolia } from "viem/chains";
import { SusuClubOnchainRef } from "@/utils/constants/addresses";

interface UnclaimedProps {
    pooler: Pooler
    deposited: boolean | null
    withdrawn: boolean | null
    cooldown: boolean | null
    cooldownTimer: number | null
}

export function Unclaimed({ pooler, deposited, withdrawn, cooldown, cooldownTimer }: UnclaimedProps) {

    const [ hr, setHr ] = useState<number | null>(null)
    const [ min, setMin ] = useState<number | null>(null)

    const getHrsMins = () => {
        // Convert remaining milliseconds into hours and minutes
        const hours = Math.floor(cooldownTimer! / (1000 * 60 * 60));
        const minutes = Math.floor((cooldownTimer! % (1000 * 60 * 60)) / (1000 * 60));
        setHr(hours)
        setMin(minutes)
        // Display remaining time as hours and minutes
        console.log(`Cooldown time remaining: ${hours} hrs ${minutes} mins`);
    }

    useEffect(()=>{
        getHrsMins()
    }, [cooldownTimer])


    const { writeContract } = useWriteContract()

    const claimMemberBonus = () => {
        writeContract({
            abi: [
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "member",
                            "type": "address"
                        }
                    ],
                    "name": "claimMemberBonus",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
            ],
            address: SusuClubOnchainRef,
            functionName: "claimMemberBonus",
            args: [(pooler.address! as `0x${string}`)],
            chainId: baseSepolia.id
        })
    }

    return (
        <>
            {
                //vs
                deposited === null && (
                    <>loading</>
                )
            }
            {
                //not depsied
                deposited === false && (
                    <div className="w-[26rem]">
                        <Alert className="w-108">
                            <Terminal className="h-4 w-4" />
                            <AlertTitle>Make a Depsoit!</AlertTitle>
                            <AlertDescription>
                                ⚠️Top up your Susu Box with at least $2 to qualify for bonus rewards🚧
                            </AlertDescription>
                        </Alert>
                    </div>
                )        
            }
            
            {
                //deposited (claimable | unclaimbale)
                deposited && (
                    <>
                        {
                            deposited && withdrawn && (
                                <>
                                    <div className="w-[26rem]">
                                        <Alert className="w-108">
                                            <Terminal className="h-4 w-4" />
                                            <AlertTitle>Hi 👋🏄 <span className="italic font-semibold">{pooler?.ens}</span>.susu.box</AlertTitle>
                                            <AlertDescription>
                                                🙃 You have a qualifying deposit but you have withdrawn too quickly & did not pass the cooldown test🥶. You cannot claim your bonus or enter the invite game 😢
                                            </AlertDescription>
                                        </Alert>
                                    </div>
                                </>
                            )

                        }
                        {
                            deposited && withdrawn == false && (
                                <>
                                    {
                                        //still cooling
                                        cooldown == false && (
                                            <>
                                                <div className="flex flex-col gap-16 w-[26rem]">
                                                    <Alert>
                                                        <Terminal className="h-4 w-4" />
                                                        <AlertTitle>Hi 👋🏄 <span className="italic font-semibold">{pooler?.ens}</span>.susu.box</AlertTitle>
                                                        <AlertDescription>
                                                            🥳 You have a qualifying deposit & are in smart saver cooldown mode❄️. You can claim your bonus and enter the invite game 36hrs from your qualifying deposit. GL 🤞🙏
                                                        </AlertDescription>
                                                    </Alert>
                                                    <div className="flex flex-col w-full items-center gap-16">
                                                        <p className="font-bold">Cooldown time remaining:</p>
                                                        <p className="text-xl font-black">
                                                            <span className="text-8xl">{`${hr}`}</span>
                                                            <span>{hr! <= 1 ? "hr" : "hrs"}</span>
                                                            <span className="text-8xl">{`${min}`}</span>
                                                            <span>{min! <= 1 ? "min" : "mins"}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                        
                                    }
                                    {
                                        //cool down
                                        cooldown && (
                                            <>
                                                <div className="flex flex-col gap-16 w-[26rem]">
                                                    <Alert>
                                                        <Terminal className="h-4 w-4" />
                                                        <AlertTitle>Hi 👋🏄 <span className="italic font-semibold">{pooler?.ens}</span>.susu.box</AlertTitle>
                                                        <AlertDescription>
                                                            🥳 You have a qualifying deposit & have passed the smart saver cooldown❄️. You can claim your bonus and enter the invite game! 🏆🌊
                                                        </AlertDescription>
                                                    </Alert>
                                                    <div className="flex flex-col w-full items-center gap-16">
                                                        <p className="font-bold">Click below to claim your Bonus:</p>
                                                        <div className="flex">
                                                            <span className="text-xl max-md:text-base text-gray-700">$</span>
                                                            <p className="text-8xl">2</p>
                                                        </div>
                                                        
                                                        <Button onClick={claimMemberBonus}>Get Bonus 🎉</Button>
                                                    </div>
                                                </div>
                                            </>
                                        )

                                    }
                                </>
                            )
                        }   
                    </>
                )
            }
        </>
    )
}