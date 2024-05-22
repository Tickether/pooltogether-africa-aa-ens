import mongoose from "mongoose"
const { Schema } = mongoose

const DepositSchema = new mongoose.Schema(
    {
        address: {
            type: String,
            required: true,
        },
        target: {
            type: String,
            required: true,
        },
        txn: {
            type: String,
            unique: true,
        },
        amount: {
            type: String,
            required: true,
        },
        txOf: {
            type: String,
            required: true,
            enum: ['deposit', 'withdraw']
        },
    },
    {
        timestamps: true, // Add timestamps
    }
)

const Deposit = mongoose.models.Deposit || mongoose.model('Deposit', DepositSchema)

export default Deposit