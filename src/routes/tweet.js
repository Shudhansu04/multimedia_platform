import { Router } from 'express';
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet,
} from "../controllers/tweet.js";
import { verifyJWT } from "../middlewares/auth.js";

const router = Router();

router.use(verifyJWT);

/**
 * @swagger
 * tags:
 *   name: Tweets
 *   description: Tweet management
 */

/**
 * @swagger
 * /tweets:
 *   post:
 *     summary: Create a new tweet
 *     tags: [Tweets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tweet created successfully
 *       400:
 *         description: Invalid input
 */
router.route("/").post(verifyJWT, createTweet);

/**
 * @swagger
 * /tweets/user/{userId}:
 *   get:
 *     summary: Get tweets by a specific user
 *     tags: [Tweets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: List of tweets
 *       404:
 *         description: User not found
 */
router.route("/user/:userId").get(verifyJWT, getUserTweets);

/**
 * @swagger
 * /tweets/{tweetId}:
 *   patch:
 *     summary: Update a tweet
 *     tags: [Tweets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tweetId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the tweet to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tweet updated successfully
 *       404:
 *         description: Tweet not found
 *
 *   delete:
 *     summary: Delete a tweet
 *     tags: [Tweets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tweetId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the tweet to delete
 *     responses:
 *       200:
 *         description: Tweet deleted successfully
 *       404:
 *         description: Tweet not found
 */
router
  .route("/:tweetId")
  .patch(verifyJWT, updateTweet)
  .delete(verifyJWT, deleteTweet);

export default router;
