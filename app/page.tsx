import { Login } from '@/components/login/Login';
import Image from 'next/image'
import Link from 'next/link';

export default function Home() {
  return (
    <main className='flex h-full flex-col items-center justify-between'>
      <div className='flex w-full flex-col'>

        <div className='flex w-full px-36 py-8 justify-between max-md:px-4'>
          <p className='font-bold text-2xl'>susu club</p>
          <div className='flex gap-1 items-center'>
            <p>How it Works</p>
              <Image 
                className='max-md:h-4 max-md:w-4'
                src='./UpLeft.svg'
                alt=''
                width={20}
                height={20}
              />
          </div>
        </div>

        <div className='flex flex-col justify-center w-full h-[36rem] gap-20 bg-welcomeGray items-center max-md:px-4'>
          <Image 
            className='absolute z-10'
            src='./Nuke.svg'
            alt=''
            width={600}
            height={600}
          />
          <p className='text-center z-20'>Introducing Susu Club</p>
          <p className='font-bold text-center text-6xl z-20'>A new <span className='text-blue-700 bg-blue-100 rounded-lg px-2 pb-2'>way</span> to <span className='bg-green-300 rounded-lg px-2 pb-2'>save</span> in <span className='text-blue-700'>dollars</span></p>
          <Login/>
        </div>

        <div className='flex w-full px-36 py-8 items-center justify-between bg-howItWorksGray max-md:flex-col'>
          <div className='flex w-full flex-col max-md:flex-col-reverse items-center'>
            <div className='flex w-48 h-48 justify-center'>
              <Image 
                src='./deposit.svg'
                alt=''
                width={150}
                height={150}
              />
            </div>
            <div>
              <p className='text-center'>Save in Dollars</p>
              <p className='text-center text-sm text-gray-400'>with your local cedis</p>  
            </div>
          </div>
          <div className='flex w-full flex-col max-md:flex-col-reverse items-center'>
            <div className='flex w-48 h-48 justify-center'>
              <Image 
                src='./noLoss.svg'
                alt=''
                width={150}
                height={150}
              />
            </div>
            <div>
              <p className='text-center'>Withdraw Anytime</p>
              <p className='text-center text-sm text-gray-400'>without any loss</p>
            </div>
          </div>
          <div className='flex w-full flex-col max-md:flex-col-reverse items-center'>
            <div className='flex w-48 h-48 justify-center'>
              <Image 
                src='./winPrizes.svg'
                alt=''
                width={150}
                height={150}
              />
            </div>
            <div>
              <p className='text-center'>Win Prizes</p>
              <p className='text-center text-sm text-gray-400'>for saving dollars</p>
            </div>
          </div>
        </div>

        <div className='flex w-full px-36 py-8 justify-between max-md:px-4'>
          <div className='flex gap-1 items-center'>
            <p className='max-md:text-xs'>Susu Club Mission</p>
            <Image
              className='max-md:h-4 max-md:w-4' 
              src='./UpLeft.svg'
              alt=''
              width={20}
              height={20}
            />
          </div>

          <div className='flex gap-1 items-center'>
            <Link href='https://twitter.com/susudotclub' target='_blank'>
              <Image 
                className='max-md:h-4 max-md:w-4' 
                src='./twitter.svg'
                alt=''
                width={20}
                height={20}
              /> 
            </Link>
            <Link href='https://warpcast.com/susuclub' target='_blank'>
              <Image 
                className='max-md:h-4 max-md:w-4' 
                src='/farcaster.png'
                alt=''
                width={20}
                height={20}
              /> 
            </Link>
            {/** <p className='underline max-md:text-sm'>susuclub</p> */}
          </div>

          <div className='flex gap-1 items-center'>
            <Image 
              className='max-md:h-4 max-md:w-4' 
              src='./ghana.svg'
              alt=''
              width={20}
              height={20}
            />
            <p className='text-xs max-md:text-[7px]'>Trusted by Ghana, Built for Africa</p>
          </div>
        </div>
      </div>
    </main>
  );
}
