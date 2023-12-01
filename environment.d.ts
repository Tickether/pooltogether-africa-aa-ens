declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_INFURA_API_KEY: string
            NEXT_PUBLIC_BICONOMY_BUNDLER_URL: string
            NEXT_PUBLIC_BICONOMY_PAYMASTER_URL: string
            NEXT_PUBLIC_BICONOMY_TEST_BUNDLER_URL: string
            NEXT_PUBLIC_BICONOMY_TEST_PAYMASTER_URL: string
            NEXT_PUBLIC_MAGIC_API_KEY: string
            NEXT_PUBLIC_FLUTTERWAVE_KEY: string
            NEXT_PUBLIC_FLUTTERWAVE_TEST_KEY: string
            NEXT_PUBLIC_PRIVATE_KEY: `0x${string}`
            MONGO: string
        }
    }
}
  
// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}