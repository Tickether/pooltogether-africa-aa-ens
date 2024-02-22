import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { config } from '@/utils/config'
import { headers } from 'next/headers' 
import { cookieToInitialState } from 'wagmi'
import { WagmiContext } from '@/providers/WagmiContext'
import { PrivyContext } from '@/providers/PrivyContext'
import { BiconomyContext } from '@/providers/BiconomyContext'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Susu Club',
  description: 'Join millions of Africans saving a least a dollar a day',
};

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
    <html lang="en">
      <body className={inter.className}>
        <WagmiContext initialState={initialState!}>
          <PrivyContext>
            <BiconomyContext>
              {children}
            </BiconomyContext>
          </PrivyContext>
        </WagmiContext>
      </body>
    </html>
  );
}
