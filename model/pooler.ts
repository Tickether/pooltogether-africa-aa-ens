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
    ens: {
        type: String,
        unique: true,
        required: true,

    },
})

const Pooler = mongoose.models.Pooler || mongoose.model("Pooler", PoolerSchema)

export default Pooler