"use client";

import { useRouter } from "next/navigation";
import { usePrivy, User } from "@privy-io/react-auth";
import { useLogin } from "@privy-io/react-auth";
import { usePlausible } from "next-plausible";
import { Button } from "./ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";



//import { usePlausible } from "next-plausible"

export function Login() {
    const router = useRouter()
    const plausible = usePlausible()
    
    const { ready, authenticated } = usePrivy()
    const { login } = useLogin({
        onComplete: ( wasAlreadyAuthenticated) => {
            
            setWasAuthenticated(wasAlreadyAuthenticated);        
        }
    })
    const [logging, setLogging] = useState<boolean>(false);
    const [wasAuthenticated, setWasAuthenticated] = useState<User | null>(null);

    useEffect(() => {
        if (logging && wasAuthenticated) {
            setLogging(false)
            router.replace("/susu");
        }
    }, [wasAuthenticated, logging, router]);

    const Login = async () => {
        try {
            setLogging(true)
            plausible("loginEvent")

            if (!authenticated) {
                login()
            }
        } catch (error) {
            console.log(error)
        }
    }

    
    return (
        <Button disabled={!ready} onClick={Login} className="w-48 rounded-full bg-blue-600 cursor-pointer z-20 hover:bg-green-400">
            <div className="flex w-full justify-between">
              <p>Enter Susu Box</p>
              <Image
                src="./LeftArrow.svg"
                alt=""
                width={20}
                height={20}
              />
            </div>
        </Button>
    );
}