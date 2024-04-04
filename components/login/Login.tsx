'use client'


import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { useEffect } from 'react';
import Image from 'next/image';

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

    
    return (
        <Button onClick={Login} className='w-48 rounded-full bg-blue-600 cursor-pointer z-20 hover:bg-green-400'>
            <div className='flex w-full justify-between'>
              <p>Join Susu</p>
              <Image
                src='./LeftArrow.svg'
                alt=''
                width={20}
                height={20}
              />
            </div>
        </Button>
    );
}