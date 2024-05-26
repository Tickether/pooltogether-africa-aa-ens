export const twabABI = [
    {
        inputs: [{ name: "vault", type: "address" }, { name: "user", type: "address" }],
        name: 'delegateBalanceOf',
        outputs: [{ name: "", type: "uint256" },],
        stateMutability: 'nonpayable',
        type: 'function',
    },
] as const; 
