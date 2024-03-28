import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { config } from '@/utils/config'
import { headers } from 'next/headers' 
import { cookieToInitialState } from 'wagmi'
import { WagmiContext } from '@/providers/WagmiContext'
import { PrivyContext } from '@/providers/PrivyContext'
import { BiconomyContext } from '@/providers/BiconomyContext'
import { Toaster } from '@/components/ui/toaster'



export const metadata: Metadata = {
  title: 'susu club',
  description: 'Join millions saving a least a dollar a day',
};

const satoshi = localFont({
  src: [
    {
      path: "../fonts/Satoshi-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Satoshi-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState( 
    config, 
    headers().get('cookie') 
  ) 
  
  return (
    <html lang="en" className={satoshi.className}>
      <body>
        <WagmiContext initialState={initialState!}>
          <PrivyContext>
            <BiconomyContext>
              <Toaster />
              {children}
            </BiconomyContext>
          </PrivyContext>
        </WagmiContext>
      </body>
    </html>
  );
}
