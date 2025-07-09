import mongoose from "mongoose";
import { User } from "../models/user.js";
import { Subscription } from "../models/subscription.js";
import ApiError  from "../utils/ApiError.js";
import  ApiResponse  from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const subscriberId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  if (channelId.toString() === subscriberId.toString()) {
    throw new ApiError(400, "You cannot subscribe to yourself");
  }

  const existingSubscription = await Subscription.findOne({
    channel: channelId,
    subscriber: subscriberId,
  });

  let message = "";
  if (existingSubscription) {
    await Subscription.findByIdAndDelete(existingSubscription._id);
    message = "Unsubscribed successfully";
  } else {
    await Subscription.create({
      channel: channelId,
      subscriber: subscriberId,
    });
    message = "Subscribed successfully";
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, message));
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const subscribers = await Subscription.find({ channel: channelId })
    .populate("subscriber", "username fullname avatar");

  return res.status(200).json(
    new ApiResponse(
      200,
      { count: subscribers.length, subscribers },
      "Subscribers fetched successfully"
    )
  );
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber ID");
  }

  const subscriptions = await Subscription.find({ subscriber: subscriberId })
    .populate("channel", "username fullname avatar");

  return res.status(200).json(
    new ApiResponse(
      200,
      { count: subscriptions.length, channels: subscriptions.map(sub => sub.channel) },
      "Subscribed channels fetched successfully"
    )
  );
});

export {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
};
