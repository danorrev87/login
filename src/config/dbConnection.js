import mongoose from "mongoose";
import { config } from "./config.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(config.mongo.url);
        console.log('Database connected successfully');
    } catch (error) {
        console.log(`Error connecting to the database ${error.message}`)
    }
}