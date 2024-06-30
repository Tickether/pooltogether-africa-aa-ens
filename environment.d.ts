import { string } from "zod"

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_PRIVY_APP_ID: string
            NEXT_PUBLIC_ALCHEMY_API_KEY: string;
            NEXT_PUBLIC_BICONOMY_BUNDLER_URL: string
            NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY: string
            NEXT_PUBLIC_STRIPE_PUBLIC_KEY: string
            STRIPE_SECRET_KEY: string
            SUSU_API_KEY: string
            CASHRAMP_API_SECRET_KEY: string
            CASHRAMP_WEBHOOK_TOKEN: string
            MONGO: string
            BASE_URL: string
            
        }
    }
}
  
// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}