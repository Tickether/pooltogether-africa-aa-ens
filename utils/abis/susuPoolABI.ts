export const susuPoolABI = [
    {
        inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }],
        name: 'dripSusuPool',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
] as const;