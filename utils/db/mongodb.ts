import mongoose from "mongoose"

export default async function connectDB () {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO)
            console.log('db connected')
        }
    } catch (error) {
        console.log(error)
    }    
}
