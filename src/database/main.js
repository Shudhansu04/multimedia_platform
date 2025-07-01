import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
try {
    const connectionTnstances = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`) ;
    console.log(`\n MongoDB connected !! DB HOST : ${connectionTnstances.connection.host}`)
} catch (error) {
    console.log("MONGODB CAN't ABLE TO CONNECT", error);
    process.exit(1);
}
}

export default connectDB;