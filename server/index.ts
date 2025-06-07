import express from "express"
import dotenv from "dotenv";
import connectDB from "./db/ConnectDB";
import userRoutes from "./routes/user.route";
import restaurantRoutes from "./routes/restaurant.route";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();
const app = express();


const PORT = process.env.PORT || 3000

//default middleware for  every mern stack
app.use(bodyParser.json({limit:"10mb"}));
app.use(bodyParser.urlencoded({limit:"10mb",extended:true}));
app.use(express.json());
app.use(cookieParser());
const corsOptions={
    origin:"http://localhost:5173",
    credentials:true,
    
}
app.use(cors(corsOptions));



app.use("/api/v1/user", userRoutes);   
app.use("/api/v1/restaurant", restaurantRoutes);





app.listen(PORT, () => {
    connectDB();
    console.log(`Server listening at http://localhost:${PORT}`);
}).on('error', (err) => {
    console.error('Error starting server:', err);
});