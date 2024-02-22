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
        required: true,
    },
    last: {
        type: String,
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
    phone: {
        type: String,
        unique: true,
        required: true,
    },
    
})

const Pooler = mongoose.models.Pooler || mongoose.model('Pooler', PoolerSchema)

export default Pooler