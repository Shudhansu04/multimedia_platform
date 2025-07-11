import { Router } from 'express';
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
} from "../controllers/like.js";
import { verifyJWT } from "../middlewares/auth.js";

const router = Router();
router.use(verifyJWT);

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Manage likes for videos, comments, and tweets
 */

/**
 * @swagger
 * /likes/toggle/v/{videoId}:
 *   post:
 *     summary: Toggle like on a video
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the video
 *     responses:
 *       200:
 *         description: Video like toggled successfully
 */

/**
 * @swagger
 * /likes/toggle/c/{commentId}:
 *   post:
 *     summary: Toggle like on a comment
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment
 *     responses:
 *       200:
 *         description: Comment like toggled successfully
 */

/**
 * @swagger
 * /likes/toggle/t/{tweetId}:
 *   post:
 *     summary: Toggle like on a tweet
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tweetId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the tweet
 *     responses:
 *       200:
 *         description: Tweet like toggled successfully
 */

/**
 * @swagger
 * /likes/videos:
 *   get:
 *     summary: Get all liked videos by the user
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of liked videos
 */
router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/videos").get(getLikedVideos);

export default router;
