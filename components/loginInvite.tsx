"use client";

import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useLogin } from "@privy-io/react-auth";
import { usePlausible } from "next-plausible";
import { Button } from "./ui/button";
import Image from "next/image";



interface LoginInviteProps {
    ens: string
}


export function LoginInvite({ ens } : LoginInviteProps) {
    const router = useRouter()
    const plausible = usePlausible()
    
    const { authenticated } = usePrivy()
    const { login } = useLogin({
        onComplete() {
            router.push("/susu")
        }
    })
    

    const Login = async () => {
        try {
            console.log()
            plausible("loginEvent")
            if (authenticated) {
                router.push("/susu")
            }
            if (!authenticated) {
                login()
            }
        } catch (error) {
            console.log(error)
        }
    }

    
    return (
        <Button onClick={Login} className="w-48 rounded-full bg-blue-600 cursor-pointer z-20 hover:bg-green-400">
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