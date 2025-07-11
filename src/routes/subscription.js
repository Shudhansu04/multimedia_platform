import express from "express";
import { verifyJWT } from "../middlewares/auth.js";
import {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels
} from "../controllers/subscription.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: Manage channel subscriptions
 */

/**
 * @swagger
 * /subscriptions/toggle/{channelId}:
 *   post:
 *     summary: Toggle subscription for a channel (subscribe/unsubscribe)
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the channel to toggle subscription
 *     responses:
 *       200:
 *         description: Subscription toggled successfully
 *       400:
 *         description: Invalid channel ID
 */
router.post("/toggle/:channelId", verifyJWT, toggleSubscription);

/**
 * @swagger
 * /subscriptions/subscribers/{channelId}:
 *   get:
 *     summary: Get list of subscribers for a channel
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the channel
 *     responses:
 *       200:
 *         description: List of subscribers retrieved successfully
 */
router.get("/subscribers/:channelId", getUserChannelSubscribers);

/**
 * @swagger
 * /subscriptions/subscriptions/{subscriberId}:
 *   get:
 *     summary: Get list of channels a user has subscribed to
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: subscriberId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the subscribing user
 *     responses:
 *       200:
 *         description: List of subscribed channels retrieved successfully
 */
router.get("/subscriptions/:subscriberId", getSubscribedChannels);

export default router;
