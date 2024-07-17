import mongoose from "mongoose"
const { Schema } = mongoose

const IncentiveSchema = new mongoose.Schema(
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
            required: true,
        },
        amount: {
            type: String,
            required: true,
        },
        txOf: {
            type: String,
            required: true,
            enum: ["deposit", "withdraw", "reward", "incentive"]
        },
    },
    {
        timestamps: true, // Add timestamps
    }
)

const Incentive = mongoose.models.Incentive || mongoose.model("Incentive", IncentiveSchema)

export default Incentive