import mongoose from "mongoose"
import 'colors'

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`.bgGreen);
    } catch (error) {
        console.log(`Error: ${error.message}`.bgRed);
    }
}

export default connectDB;