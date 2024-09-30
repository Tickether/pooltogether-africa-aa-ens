import { encodeFunctionData } from "viem"
import { SusuClubOnchainRef } from "../constants/addresses";


export const claimInviteReward = (invited: `0x${string}`[]) => {
    const claimInviteRewardData = encodeFunctionData({
        abi: [
            {
				"inputs": [
					{
						"internalType": "address[]",
						"name": "invitees",
						"type": "address[]"
					}
				],
				"name": "claimInviteBonus",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
        ],
        functionName: 'claimInviteBonus',
        args: [(invited)]
    })

    // Build the transactions
    const claimInviteRewardTx = {
        to: SusuClubOnchainRef,
        data: claimInviteRewardData,
    };
    return claimInviteRewardTx
}