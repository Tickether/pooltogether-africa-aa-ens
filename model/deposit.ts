import mongoose from "mongoose"
const { Schema } = mongoose

const DepositSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    txn: {
        type: String,
        unique: true,
        required: true,
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
})

const Deposit = mongoose.models.Deposit || mongoose.model('Deposit', DepositSchema)

export default Deposit