"use client";

import { useRouter } from "next/navigation";
import { usePrivy, User } from "@privy-io/react-auth";
import { useLogin } from "@privy-io/react-auth";
import { usePlausible } from "next-plausible";
import { Button } from "./ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useBiconomy } from "@/providers/BiconomyContext";
import { createSmartAccountClaimInvite } from "@/utils/aaClientReferrer";
import { Pooler } from "@/hooks/pooler/useGetPooler";



interface LoginInviteProps {
    poolerENS: Pooler
}


export function LoginInvite({ poolerENS } : LoginInviteProps) {
    const router = useRouter()
    const plausible = usePlausible()
    

    const { smartAccountAddress } = useBiconomy()
    const { ready, authenticated } = usePrivy()
    const { login } = useLogin({
        onComplete:( wasAlreadyAuthenticated, isNewUser  ) => {
            console.log( isNewUser )
            if (isNewUser) {
                createSmartAccountClaimInvite(poolerENS.address as `0x${string}`, smartAccountAddress! as `0x${string}`)
            }     
            setWasAuthenticated(wasAlreadyAuthenticated); 
              
        }
    })
    //console.log(poolerByENS)
    const [logging, setLogging] = useState<boolean>(false);
    const [wasAuthenticated, setWasAuthenticated] = useState<User | null>(null);

    const Login = async () => {
        try {
            setLogging(true)
            plausible("loginInviteEvent")
    
            if (!authenticated) {
                login()
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (logging && wasAuthenticated) {
            setLogging(false)
            router.replace("/susu");
        }
    }, [wasAuthenticated, logging, router]);

    
    return (
        <Button 
            onClick={Login} 
            className="w-48 rounded-full bg-blue-600 cursor-pointer z-20 hover:bg-green-400"
            disabled={!ready || authenticated || !poolerENS}
        >
            <div className="flex w-full justify-between">
              <p>Accept Invite</p>
              <Image
                src="/LeftArrow.svg"
                alt=""
                width={20}
                height={20}
              />
            </div>
        </Button>
    );
}