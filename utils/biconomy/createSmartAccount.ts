import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { ChainId } from "@biconomy/core-types"
import { provider } from "../ethers/provider"
import { bundler, paymaster } from "./hooks"
import { InitModule } from "./initModule"

export async function name() {
    const module = await InitModule()
    const biconomySmartAccount = await BiconomySmartAccountV2.create({
        provider: provider,
        chainId: ChainId.OPTIMISM_MAINNET,
        bundler: bundler,
        paymaster: paymaster,
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
        defaultValidationModule: module,
        activeValidationModule: module,
        rpcUrl: `https://optimism-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`
    })
    return biconomySmartAccount
}