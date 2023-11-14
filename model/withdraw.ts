import mongoose from "mongoose"
const { Schema } = mongoose

const WithdrawSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    txn: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    ens: {
        type: String,
        required: true,
    },
    status: {
        type: String,
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

const Withdraw = mongoose.models.Withdraw || mongoose.model('Withdraw', WithdrawSchema)

export default Withdraw