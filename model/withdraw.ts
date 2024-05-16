import mongoose from "mongoose"
const { Schema } = mongoose

const WithdrawSchema = new mongoose.Schema(
    {
        address: {
            type: String,
            required: true,
        },
        txn: {
            type: String,
            unique: true,
            required: true,
        },
        ref: {
            type: String,
            unique: true,
        },
        prizeAmount: {
            type: Number,
            required: true,
        },
        localAmount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            required: true,
        },
        rate: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ['pending', 'success']
        },
        service: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true, // Add timestamps
    }
)

const Withdraw = mongoose.models.Withdraw || mongoose.model('Withdraw', WithdrawSchema)

export default Withdraw