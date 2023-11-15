import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE } from "@biconomy/modules"
import { provider } from '../ethers/provider'

export async function InitModule () {
    const module = await ECDSAOwnershipValidationModule.create({
        signer: provider.getSigner(),
        moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE
    })
    return module
}