import { magic } from "../magic/magicProvider"
import { ethers } from "ethers"

export const provider =  new ethers.providers.Web3Provider(
    magic.rpcProvider,
    "any"
);