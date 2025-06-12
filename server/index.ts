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
import path from "path";

const app = express();

dotenv.config();

const PORT = process.env.PORT || 8001

//default middleware for  every mern stack
app.use(bodyParser.json({limit:"10mb"}));
app.use(bodyParser.urlencoded({limit:"10mb",extended:true}));
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL || 'http://localhost:5173'
        : ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    credentials: true,
}
app.use(cors(corsOptions));

// API Routes
app.use("/api/v1/user", userRoutes);   
app.use("/api/v1/restaurant", restaurantRoutes);
app.use("/api/v1/menu", menuRoutes);
app.use("/api/v1/order", orderRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    // Serve static files from the React build directory
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
}

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});