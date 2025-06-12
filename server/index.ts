import express from "express"
import dotenv from "dotenv";
import connectDB from "./db/ConnectDB";
import userRoutes from "./routes/user.route";
import restaurantRoutes from "./routes/restaurant.route";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import menuRoutes from "./routes/menu.route";
import orderRoutes from "./routes/order.route";
import cors from "cors";

dotenv.config();
const app = express();


const PORT = process.env.PORT || 8001

//default middleware for  every mern stack
app.use(bodyParser.json({limit:"10mb"}));
app.use(bodyParser.urlencoded({limit:"10mb",extended:true}));
app.use(express.json());
app.use(cookieParser());
const corsOptions={
    origin:["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    credentials:true,
}
app.use(cors(corsOptions));

app.use("/api/v1/user", userRoutes);   
app.use("/api/v1/restaurant", restaurantRoutes);
app.use("/api/v1/menu", menuRoutes);
app.use("/api/v1/order", orderRoutes);


app.listen(PORT, () => {
    connectDB();
});