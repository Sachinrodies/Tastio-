// mongopassword=WkRuFhziBU6UZaVY
// sahilrodies000
import mongoose from "mongoose"
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL! )
        console.log('mongo connected.')

    }
    catch(error){
        console.log(error);

    }
}
export default connectDB