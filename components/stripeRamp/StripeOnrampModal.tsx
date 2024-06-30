
import Image from 'next/image';
import StripeOnramp from './StripeOnramp';


interface StripeOnrampModalProps {
  setOpenRamp: (openRamp : boolean) => void
  client_secret: string
}

export function StripeOnrampModal({ setOpenRamp, client_secret } : StripeOnrampModalProps) {

    
    return (
        <main className='fixed flex flex-col z-20 bg-gray-900/25 w-screen h-screen items-center justify-center top-0 left-0 right-0 bottom-0 backdrop-blur-[0.666px]'>

            <div className='w-full h-full relative'>
                <div
                    onClick={()=>{setOpenRamp(false)}}
                    className='absolute cursor-pointer p-5 top-0 right-0'
                >
                    <Image
                        src='/close.svg' 
                        alt='close' 
                        width={20}
                        height={20}
                    />
                </div>
                <div className='flex items-center justify-center h-full w-full'>
                    <div className='bg-white p-8 rounded-lg'>
                        <StripeOnramp clientSecret={client_secret} />
                    </div>
                </div>
            </div>

        </main>
    );
}
