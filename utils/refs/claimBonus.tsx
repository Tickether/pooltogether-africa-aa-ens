import { encodeFunctionData } from "viem"
import { SusuClubOnchainRef } from "../constants/addresses";


export const claimBonus = (member: `0x${string}`) => {
    const claimBonusData = encodeFunctionData({
        abi: [
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "member",
                        "type": "address"
                    }
                ],
                "name": "claimMemberBonus",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
        ],
        functionName: 'claimMemberBonus',
        args: [(member)]
    })

    // Build the transactions
    const claimBonusTx = {
        to: SusuClubOnchainRef,
        data: claimBonusData,
    };
    return claimBonusTx
}