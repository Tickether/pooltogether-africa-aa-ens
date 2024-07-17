import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { config } from "@/utils/config"
import { headers } from "next/headers" 
import { cookieToInitialState } from "wagmi"
import { WagmiContext } from "@/providers/WagmiContext"
import { PrivyContext } from "@/providers/PrivyContext"
import { BiconomyContext } from "@/providers/BiconomyContext"
import { Toaster } from "@/components/ui/toaster"
import PlausibleProvider from "next-plausible"

import { cn } from "@/lib/utils"

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
  variable: "--font-satoshi",
});

export const metadata: Metadata = {
  title: "susu club",
  description: "get a susu box, save & win prizes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState( 
    config, 
    headers().get("cookie") 
  ) 
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <PlausibleProvider 
          domain="susu.club"
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          satoshi.variable
        )}
      >
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
