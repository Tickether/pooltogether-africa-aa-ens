import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '../ui/button'
import { ExitIcon } from '@radix-ui/react-icons'
import { usePrivy } from '@privy-io/react-auth'
import { useBiconomy } from '@/providers/BiconomyContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

  

export function Logout () {
    
    const { logout } = usePrivy()
    const { smartAccount } = useBiconomy()
    const router = useRouter()

    
    return(
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className='gap-2' variant='outline'>
                    <ExitIcon/>
                    <span className='max-md:hidden'>Close Susu</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action will log you out of your Susu account. You can no longer view your balances & winning
                    unless you login again!.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                    <Button
                        onClick={async ()=>{
                            if (smartAccount) {
                                await logout()
                                router.push('/')
                            }
                        }}
                        className='gap-2'
                    >
                        <ExitIcon/>
                        Continue
                    </Button>
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}