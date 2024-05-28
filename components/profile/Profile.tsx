'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pooler } from '@/hooks/pooler/useGetPooler'
import { FaceIcon } from '@radix-ui/react-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { usePostPooler } from '@/hooks/pooler/usePostPooler'
import { usePrivy } from '@privy-io/react-auth'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '../ui/drawer'
import { normalize } from 'viem/ens'




interface ProfileProps {
    pooler: Pooler | null
    smartAccountAddress: string
    getBackPooler: () => void
}
const FormSchema = z.object({
    susuTag: z.string(),
})



export function Profile ({ pooler, smartAccountAddress, getBackPooler } : ProfileProps) {
    const { loading, postPooler } = usePostPooler()
    const { user } = usePrivy()

    
    console.log(smartAccountAddress)

    
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            susuTag: pooler?.ens,
        },
    })

    const { setValue } = form


    const handleSusuTagChange = (e: any) => {
        try {
            (e.target.value.length >= 1)
            ? setValue('susuTag', normalize(e.target.value))
            : setValue('susuTag', (e.target.value))
        } catch (error : any) {
            console.log(error.message)
        }
    }
    const susu = form.watch('susuTag')
    console.log(susu)

    
    const getEmail = () => {
        return user?.email?.address
    }

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log({ data });
        const email = getEmail()
        if (!pooler) {
            await postPooler(
                smartAccountAddress!,
                email!,
                data.susuTag,
            )
            getBackPooler()
        } else {
            //update
        }
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button className='gap-2' variant='outline'>
                    <FaceIcon/>
                    <span className='max-md:hidden'>Edit Profile</span>
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className='mx-auto w-full max-w-sm'>
                    <DrawerHeader>
                        <DrawerTitle>Edit profile</DrawerTitle>
                        <DrawerDescription>Make changes to your profile here. Click save when done.</DrawerDescription>
                    </DrawerHeader>
                    <div className='grid gap-4 py-4'>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                                
                                <FormField
                                    control={form.control}
                                    name='susuTag'
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className='grid grid-cols-4 items-center gap-4'>
                                                <FormLabel className='text-right'>Username</FormLabel>
                                                <FormControl >
                                                    <Input disabled={!!pooler} className='col-span-3' placeholder={!pooler ? 'vitalik' : pooler.ens} {...field} onChange={handleSusuTagChange}/>
                                                </FormControl>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                        
                                <div className='flex justify-end'>
                                    <Button
                                        disabled={!!pooler || loading!}
                                        type='submit'>Save changes
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )

}