declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_PRIVY_APP_ID: string;
            NEXT_PUBLIC_BICONOMY_BUNDLER_URL: string;
            NEXT_PUBLIC_BICONOMY_PAYMASTER_URL: string;
            NEXT_PUBLIC_MAGIC_API_KEY: string;
            NEXT_PUBLIC_BLOCKCHAIN_NETWORK: string;

        }
    }
}
  
// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}