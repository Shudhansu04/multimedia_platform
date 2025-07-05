import dotenv from "dotenv";
import connectDB from "./database/main.js";
import app from "./app.js"

dotenv.config({
    path:"./.env"
});

connectDB()
.then(() => {
    app.on("error", (error) => {
        console.log(`error : ${error}`);
        throw error;
    })
    app.listen(process.env.PORT || 8000, () => {
        console.log(`server is running at PORT : ${process.env.PORT}`)
    })
})
.catch((error) => {
    console.log("MongoDB connection failed", error)

})