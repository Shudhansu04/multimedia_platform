import { Router } from 'express';
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet,
} from "../controllers/tweet.js"
import {verifyJWT} from "../middlewares/auth.js"

const router = Router();
router.use(verifyJWT);  

router.route("/").post(verifyJWT,createTweet);
router.route("/user/:userId").get(verifyJWT,getUserTweets);
router.route("/:tweetId").patch(verifyJWT,updateTweet).delete(verifyJWT,deleteTweet);

export default router