import mongoose from "mongoose"

const PoolerSchema = new mongoose.Schema({
    address: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    first: {
        type: String,
        unique: true,
        required: true,
    },
    last: {
        type: String,
        unique: true,
        required: true,
    },
    phone: {
        type: String,
        unique: true,
        required: true,
    },
    ens: {
        type: String,
        unique: true,
        required: true,

    },
    country: {
        type: String,
        required: true,
    },
    deposits: {
        type: [String]
    },
    withdrawals: {
        type: [String]
    },

})

const Pooler = mongoose.models.Pooler || mongoose.model('Pooler', PoolerSchema)

export default Pooler