import { IPaymaster, BiconomyPaymaster } from '@biconomy/paymaster'
import { IBundler, Bundler } from '@biconomy/bundler'
import { DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { ChainId } from "@biconomy/core-types"



export const bundler: IBundler = new Bundler({
  // get from biconomy dashboard https://dashboard.biconomy.io/
  bundlerUrl: process.env.NEXT_PUBLIC_BICONOMY_BUNDLER_URL,
  chainId: ChainId.OPTIMISM_MAINNET,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
})

export const paymaster: IPaymaster = new BiconomyPaymaster({
  // get from biconomy dashboard https://dashboard.biconomy.io/
  paymasterUrl: process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_URL,
})


