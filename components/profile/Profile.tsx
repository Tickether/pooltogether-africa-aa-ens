'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pooler } from '@/hooks/pooler/useGetPooler'
import { PersonIcon, FaceIcon } from '@radix-ui/react-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

import { useEffect, useState } from 'react'
import { usePostPooler } from '@/hooks/pooler/usePostPooler'
import { usePrivy } from '@privy-io/react-auth'
import { Countries } from '@/utils/constants/countries'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '../ui/drawer'
import { normalize } from 'viem/ens'




interface ProfileProps {
    pooler: Pooler | null
    smartAccountAddress: string
    getBackPooler: () => void
}
const FormSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    susuTag: z.string(),
    country: z.string(),
    phone: z.string(),
})



export function Profile ({ pooler, smartAccountAddress, getBackPooler } : ProfileProps) {
    const { loading, postPooler } = usePostPooler()
    const { user } = usePrivy()

    
    console.log(smartAccountAddress)

    //const countries = Object.keys(Countries);

    const countries: string[] = Object.values(Countries).map(country => country.name);

    
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            firstname: pooler?.first,
            lastname: pooler?.last,
            susuTag: pooler?.ens,
            country: pooler?.country,
            phone: pooler?.phone,
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

    const handlePhoneChange = (e: any) => {
        // Check if the input matches the regex pattern
        if (/^[0-9]+$/.test(e.target.value) || e.target.value === '') {
            setValue('phone', e.target.value)
        }
    } 

   
    
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
                data.firstname,
                data.lastname,
                data.susuTag,
                data.country,
                data.phone,
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
                                    name='firstname'
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className='grid grid-cols-4 items-center gap-4'>
                                                <FormLabel className='text-right'>First Name</FormLabel>
                                                <FormControl >
                                                    <Input disabled={!!pooler} className='col-span-3' placeholder={!pooler ? 'Vitalik' : pooler.first} {...field} />
                                                </FormControl>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='lastname'
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className='grid grid-cols-4 items-center gap-4'>
                                                <FormLabel className='text-right'>Last Name</FormLabel>
                                                <FormControl >
                                                    <Input disabled={!!pooler} className='col-span-3' placeholder={!pooler ? 'Buterin' : pooler.last} {...field} />
                                                </FormControl>
                                            </div>
                                        </FormItem>
                                    )}
                                />
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
                                <FormField
                                    control={form.control}
                                    name='country'
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className='grid grid-cols-4 items-center gap-4'>
                                                <FormLabel className='text-right'>Country</FormLabel>
                                                {
                                                    !pooler
                                                    ?(
                                                        <>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                <SelectTrigger className='col-span-3'>
                                                                    <SelectValue placeholder='Select a Country' />
                                                                </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className='col-span-3'>
                                                                    <SelectGroup>
                                                                        {countries!.map((country) => (
                                                                            <SelectItem
                                                                                key={country}
                                                                                value={country}
                                                                            >
                                                                                {country}
                                                                            </SelectItem> 
                                                                        ))}
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        </>
                                                    )
                                                    :(
                                                        <>
                                                        <FormControl>
                                                            <Input disabled className='col-span-3' placeholder={pooler.country} {...field} />
                                                        </FormControl>
                                                        </>
                                                    )
                                                }
                                            </div>
                                        
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='phone'
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className='grid grid-cols-4 items-center gap-4'>
                                                <FormLabel className='text-right'>Phone #</FormLabel>
                                                <FormControl >
                                                    <Input disabled={!!pooler} className='col-span-3' placeholder={!pooler ? '0506661777' : pooler.phone} {...field} onChange={handlePhoneChange} />
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