import express from "express";
import { verifyJWT } from "../middlewares/auth.js";
import {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels
} from "../controllers/subscription.js";

const router = express.Router();

router.post("/toggle/:channelId", verifyJWT, toggleSubscription);
router.get("/subscribers/:channelId", getUserChannelSubscribers);
router.get("/subscriptions/:subscriberId", getSubscribedChannels);

export default router;
