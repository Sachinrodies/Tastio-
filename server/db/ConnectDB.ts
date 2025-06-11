// mongopassword=WkRuFhziBU6UZaVY
// sahilrodies000
import mongoose from "mongoose"

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;
        
        if (!mongoURI) {
            throw new Error('MongoDB connection string is not defined in environment variables');
        }

        await mongoose.connect(mongoURI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        throw error;
    }
}

export default connectDB;