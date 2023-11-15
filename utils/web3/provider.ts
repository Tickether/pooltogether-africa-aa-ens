import { magic } from "../magic/magicProvider"
const { Web3 } = require('web3');

export const web3provider =  new Web3((magic as any).rpcProvider)