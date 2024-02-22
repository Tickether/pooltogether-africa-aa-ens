
import { Login } from '@/components/login/Login';
import Image from 'next/image'

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className='flex flex-col w-full items-center md:gap-40 gap-10'>
        <div className='flex flex-col gap-5 text-center'>
          <h1 className='text-3xl font-bold'>Welcome to the Susu Pool</h1>
          <p>Join millions of Africans saving at least a dollar a day & winning prizes daily 🌊🏆</p>
        </div>
        <div className='flex flex-col max-md:flex-col-reverse w-full items-center md:gap-40 gap-10'>
        <div className='flex gap-10 max-md:flex-col'>
          <div className='flex flex-col text-center'>
            <Image
              src='deposit.svg'
              alt='Deposit Local for Dollars'
              width={250}
              height={250}
            />
            <h4 className='font-semibold'>Save in Dollars</h4>
            <p className='text-sm'>Deposit Local for a chance to win</p>
          </div>
          <div className='flex flex-col text-center'>
            <Image
              src='winPrizes.svg'
              alt='Win Prizes'
              width={250}
              height={250}
            />
            <h4 className='font-semibold'>Win Prizes</h4>
            <p className='text-sm'>Yield from deposits fund prizes</p>
          </div>
          <div className='flex flex-col text-center'>
            <Image
              src='noLoss.svg'
              alt='No Losses'
              width={250}
              height={250}
            />
            <h4 className='font-semibold'>No Loss</h4>
            <p className='text-sm'>Withdraw any time</p>
          </div>
        </div>
        <div>
          <Login/>
        </div>
        </div>
      </div>
    </main>
  );
}
