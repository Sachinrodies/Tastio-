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
const DIRNAME = path.resolve();

const app = express();

dotenv.config();




const PORT = process.env.PORT || 3000

//default middleware for  every mern stack
app.use(bodyParser.json({limit:"2mb"}));
app.use(bodyParser.urlencoded({limit:"2mb",extended:true}));
app.use(express.json());
app.use(cookieParser());
const corsOptions={
    origin:["https://tastio-4.onrender.com"],
    credentials:true,
}
app.use(cors(corsOptions));

app.use("/api/v1/user", userRoutes);   
app.use("/api/v1/restaurant", restaurantRoutes);
app.use("/api/v1/menu", menuRoutes);
app.use("/api/v1/order", orderRoutes);
app.use(express.static(path.join(DIRNAME,"/client/dist")));

// Serve index.html for all other routes
app.get(/^(?!\/api\/v1).*/, (_, res) => {
    res.sendFile(path.resolve(DIRNAME, "client", "dist", "index.html"));
});



connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }).catch((err) => {
    console.error("Failed to connect to DB", err);
    process.exit(1);
  });