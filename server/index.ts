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

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use("/api/v1/user", userRoutes);   
app.use("/api/v1/restaurant", restaurantRoutes);
app.use("/api/v1/menu", menuRoutes);
app.use("/api/v1/order", orderRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Connect to database first, then start server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();