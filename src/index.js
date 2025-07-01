import dotenv from "dotenv";
import connectDB from "./database/main.js";

dotenv.config({
    path:"./env"
});

connectDB();