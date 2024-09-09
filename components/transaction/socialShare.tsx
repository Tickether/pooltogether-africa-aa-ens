
import Image from "next/image"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Share1Icon } from "@radix-ui/react-icons"
export function SocialShare () {

    const warpcast = `
        I've taken the plunge and fully dived into the pool at @susuclub Now you can find me swimming onchain. 🏊‍♂️💸 Ready for the next swim meet? Don’t forget your swim gear, and maybe make a splash with your own deposit. 😉 See you in the deep end! 🌊🏆
    `
    const twitter = `
        I've taken the plunge and fully dived into the pool at @susudotclub Now you can find me swimming onchain. 🏊‍♂️💸 Ready for the next swim meet? Don’t forget your swim gear, and maybe make a splash with your own deposit. 😉 See you in the deep end! 🌊🏆
    `

    const urlEmbedded = "https://susu.club/"

    return (
        <>
            <div className="flex w-full justify-end">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <Share1Icon/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                            onSelect={()=>{
                                const cast = encodeURIComponent(warpcast.trim());
                                const shareUrl = `https://warpcast.com/~/compose?text=${cast}&embeds[]=${urlEmbedded}`
                                window.open(shareUrl, "_blank");
                            }}
                        >
                            <div className="flex gap-2 items-center">
                                <Image 
                                    className="max-md:h-4 max-md:w-4" 
                                    src="/farcaster.png"
                                    alt=""
                                    width={20}
                                    height={20}
                                />
                                <span>Warpcast</span> 
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onSelect={()=>{
                                const tweet = encodeURIComponent(twitter.trim());
                                const shareUrl = `https://twitter.com/intent/tweet?text=${tweet}&url=${encodeURIComponent(urlEmbedded)}`;
                                window.open(shareUrl, "_blank");
                            }}
                        >
                            <div className="flex gap-2 items-center">
                                <Image 
                                    className="max-md:h-4 max-md:w-4" 
                                    src="./twitter.svg"
                                    alt=""
                                    width={20}
                                    height={20}
                                /> 
                                <span>Twitter</span>
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    )
}