import { encodeFunctionData } from "viem"
import { SusuClubOnchainRef } from "../constants/addresses";


export const claimInvite = (referrer: `0x${string}`, invited: `0x${string}`) => {
    const claimInviteData = encodeFunctionData({
        abi: [
            {
				"inputs": [
					{
						"internalType": "address",
						"name": "referrer",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "invited",
						"type": "address"
					}
				],
				"name": "claimInvite",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
        ],
        functionName: 'claimInvite',
        args: [(referrer), (invited)]
    })

    // Build the transactions
    const claimInviteTx = {
        to: SusuClubOnchainRef,
        data: claimInviteData,
    };
    return claimInviteTx
}