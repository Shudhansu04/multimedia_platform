import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to the Multimedia Platform API!");
});

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json({
    limit : "16kb"
}))

app.use(express.urlencoded({
    extended: true,
    limit : "16kb"
}))

app.use(express.static("public"))

app.use(cookieParser()) 

//routes import
import userRouter from "./routes/user.js";
import healthCheckRouter from "./routes/healthCheck.js"
import tweetRouter from "./routes/tweet.js"
import subscriptionRouter from "./routes/subscription.js"
import videoRouter from "./routes/video.js"
import commentRouter from "./routes/comments.js"
import likeRouter from "./routes/like.js"
import playlistRouter from "./routes/playlist.js"
import channelRouter from "./routes/channel.js"


// routes declaration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/health",healthCheckRouter)
app.use("/api/v1/tweets",tweetRouter)
app.use("/api/v1/subscriptions",subscriptionRouter)
app.use("/api/v1/videos",videoRouter)
app.use("/api/v1/comments",commentRouter)
app.use("/api/v1/likes",likeRouter)
app.use("/api/v1/playlists",playlistRouter)
app.use("/api/v1/channel",channelRouter)

export default app;