import { Terminal } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { Pooler } from "@/hooks/pooler/useGetPooler"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { motion } from "framer-motion"
import { claimMemberBonus } from "@/utils/aaClientReferrer"
import { preGameList } from "@/utils/constants/preGameList"
import { useQueryClient } from "@tanstack/react-query"
import { useBlockNumber, useReadContract } from "wagmi"
import { invitedByDead, SusuClubOnchainRef } from "@/utils/constants/addresses"
import { base } from "viem/chains"
import { usePlausible } from "next-plausible"


interface UnclaimedProps {
    pooler: Pooler
    deposited: boolean | null
    withdrawn: boolean | null
    cooldown: boolean | null
    cooldownTimer: number | null
}

export function Unclaimed({ pooler, deposited, withdrawn, cooldown, cooldownTimer }: UnclaimedProps) {

    const plausible = usePlausible()

    const [ hr, setHr ] = useState<number | null>(null)
    const [ min, setMin ] = useState<number | null>(null)
    
    const [loading, setLoading] = useState<boolean>(false)

    const queryClient = useQueryClient()  
    const { data: blockNumber } = useBlockNumber({ watch: true }) 


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


    const claimBonus = () => {
        setLoading(true)
        const res = claimMemberBonus(pooler.address as `0x${string}`)
        plausible("claimBonus")
        // Add a 3-second delay
        setTimeout(() => {
            setLoading(false);
        }, 3666);
    }

    const preGamer = preGameList.includes(pooler.address)
    console.log("preGamer:", preGamer)

    const {data: invitedBy, queryKey} = useReadContract({
        abi: [
            {
				"inputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"name": "referrerOf",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
        ],
        address: SusuClubOnchainRef,
        functionName: "referrerOf",
        args: [(pooler.address! as `0x${string}`)],
        chainId: base.id
    })
    useEffect(() => { 
        queryClient.invalidateQueries({ queryKey }) 
    }, [blockNumber, queryClient, queryKey]) 
    console.log(invitedBy)

    return (
        <>
            {
                preGamer 
                ? (
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
                                
                                <Button className="w-full" onClick={claimBonus}>
                                {
                                    loading
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
                                            Get Bonus 🎉
                                        </>
                                    )
                                }
                                </Button>
                            </div>
                        </div>
                    </>
                )
                : (
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
                                <div className="flex flex-col gap-16 w-[26rem]">
                                    <Alert>
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
                                                <div className="flex flex-col gap-16 w-[26rem]">
                                                    <Alert>
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
                                                                        <p className="text-8xl">
                                                                            {
                                                                                invitedBy === invitedByDead 
                                                                                ?<>{2}</>
                                                                                :<>{3}</>
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    
                                                                    <Button className="w-full" onClick={claimBonus}>
                                                                    {
                                                                        loading
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
                                                                                Get Bonus 🎉
                                                                            </>
                                                                        )
                                                                    }
                                                                    </Button>
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
        </>
    )
}