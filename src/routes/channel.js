import { Router } from 'express';
import {
    getChannelStats,
    getChannelVideos,
} from "../controllers/channel.js";
import { verifyJWT } from "../middlewares/auth.js";

const router = Router();

router.use(verifyJWT);

/**
 * @swagger
 * tags:
 *   name: Channel
 *   description: Channel statistics and video management
 */

/**
 * @swagger
 * /channel/stats:
 *   get:
 *     summary: Get channel statistics
 *     tags: [Channel]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Channel statistics retrieved successfully
 *       401:
 *         description: Unauthorized - missing or invalid token
 */
router.route("/stats").get(getChannelStats);

/**
 * @swagger
 * /channel/videos:
 *   get:
 *     summary: Get videos uploaded by the current user (channel)
 *     tags: [Channel]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of channel videos
 *       401:
 *         description: Unauthorized - missing or invalid token
 */
router.route("/videos").get(getChannelVideos);

export default router;
