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
    phone: {
        type: Number,
   
    },
    ens: {
        type: String,
        unique: true,

    },
    country: {
        type: String,
        
    },
    currency: {
        type: String,
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