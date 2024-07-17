import { Separator } from "./ui/separator"
import { trimDecimals } from "@/utils/trim"

interface BalancesProp{
    balance: string
    boostBalance: string

}

export function Balances ({ balance, boostBalance }: BalancesProp) {


    return (
        <>
            <main className="flex flex-col w-full items-center gap-16">
                {/**Misc Balances */}
                <div className="flex flex-col w-full items-center">
                    <Separator className="my-4 max-md:mb-8"  />
                    <div className="flex h-5 items-center space-x-4 text-sm">
                        <div>
                            <p className="font-semibold max-md:text-center">Rewards Boost</p>
                            <p className="text-center"><span>$</span>{boostBalance}</p>
                        </div>
                    </div>
                </div>
                {/**Susu Balance */}
                <div className="flex">
                    <span className="text-xl max-md:text-base text-gray-700">$</span>
                    <p className="text-6xl max-md:text-3xl max-md:text-center font-bold text-center">
                        {trimDecimals(balance!)}
                    </p>
                </div>
            </main>
        </>
    )
}