import Image from 'next/image';


interface RampProps {
    setOpenRamp: (openRamp : boolean) => void
    paymentType: string
    address: string
    amount: string
    reference: string
    currency: string
}

export function Ramp({ setOpenRamp, paymentType, address, amount, reference, currency } : RampProps) {

    
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
                <div className='h-full w-full'>
                    <iframe
                        src={
                            `
                                https://useaccrue.com/hosted/ramp?key=CSHRMP-PUBK_mO86nNyK8gOwP5Ho&paymentType=${paymentType}&address=${address}&coin=USDC&network=OP&amount=${amount}&reference=${reference}&isWalletContext=false
                            `
                        }
                        title="cashRamp"
                        className='w-full h-full'
                    ></iframe>
                </div>
            </div>

        </main>
    );
}

//&currency=${currency}