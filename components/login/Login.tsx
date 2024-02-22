'use client'


import { useBiconomy } from '@/providers/BiconomyContext';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { useEffect } from 'react';

export function Login() {
    const router = useRouter()
    const { login, ready, authenticated } = usePrivy()

    const Login = async () => {
        try {
            if (authenticated) {
                router.push('/susu')
            }
            if (!authenticated) {
                login()
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (authenticated) {
            router.push('/susu')
        }
    }, [authenticated, router])

    return <Button disabled={!ready} onClick={Login}>Check Susu</Button>;
}