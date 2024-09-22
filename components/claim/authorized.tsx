import Image from "next/image";
import { Logout } from "../logout";
import { Button } from "../ui/button";
import { Landmark, Undo } from "lucide-react";
import { useRouter } from "next/navigation";

export function Authorized() {

    const router = useRouter()
    
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
                        //member bonus claimed
                        //vs
                        //member bonus not claimed
                    }
                </div>
            </main>
        </>
    )   
}