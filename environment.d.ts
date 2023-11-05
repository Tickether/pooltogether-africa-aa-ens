declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_W3M_PROJECT_ID: string;
            NEXT_PUBLIC_ALCHEMY_API_KEY: string;
            MONGO: string;

        }
    }
}
  
// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}