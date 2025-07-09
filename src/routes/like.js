import { Router } from 'express';
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
} from "../controllers/like.js"
import {verifyJWT} from "../middlewares/auth.js"

const router = Router();
router.use(verifyJWT);  

router.route("/toggle/v/:videoId").post(verifyJWT,toggleVideoLike);
router.route("/toggle/c/:commentId").post(verifyJWT,toggleCommentLike);
router.route("/toggle/t/:tweetId").post(verifyJWT,toggleTweetLike);
router.route("/videos").get(verifyJWT,getLikedVideos);

export default router