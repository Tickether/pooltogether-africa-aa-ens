import { Magic } from "magic-sdk"

// Initialize the Magic instance
export const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_API_KEY, {
    network: {
        rpcUrl: `https://optimism-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
        chainId: 10, // or preferred chain
    },
})