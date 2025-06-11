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
    } catch (error) {
        process.exit(1); // Exit with failure
    }
}

export default connectDB;