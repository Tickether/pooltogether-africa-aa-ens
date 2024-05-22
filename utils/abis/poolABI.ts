export const poolABI = [
    {
        inputs: [{ name: "_assets", type: "uint256" }, { name: "_receiver", type: "address" }],
        name: 'deposit',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ name: "_assets", type: "uint256" }, { name: "_receiver", type: "address" }, { name: "_owner", type: "address" }],
        name: 'withdraw',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { name: "sender", type: "address" }, 
            { name: "receiver", type: "address" },
            { name: "owner", type: "address" },
            { name: "assets", type: "uint256" },
            { name: "shares", type: "uint256" },
        ],
        name: 'Withdraw',
        //outputs: [],
        //stateMutability: 'nonpayable',
        type: 'event',

    }
] as const; 
