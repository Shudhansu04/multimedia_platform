import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.js";
import { User } from "../models/user.js";
import ApiError  from "../utils/ApiError.js";
import  ApiResponse  from "../utils/ApiResponse.js";
import  asyncHandler  from "../utils/asyncHandler.js";

 
const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Tweet content cannot be empty");
  }

  const tweet = await Tweet.create({
    content,
    owner: req.user._id,
  });

  return res.status(201).json(
    new ApiResponse(201, tweet, "Tweet created successfully")
  );
});

 
const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const tweets = await Tweet.find({ owner: userId }).sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, tweets, "User tweets fetched successfully")
  );
});

 
const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const tweet = await Tweet.findOne({ _id: tweetId, owner: req.user._id });

  if (!tweet) {
    throw new ApiError(404, "Tweet not found or unauthorized");
  }

  tweet.content = content || tweet.content;
  await tweet.save();

  return res.status(200).json(
    new ApiResponse(200, tweet, "Tweet updated successfully")
  );
});

 
const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const tweet = await Tweet.findOneAndDelete({
    _id: tweetId,
    owner: req.user._id,
  });

  if (!tweet) {
    throw new ApiError(404, "Tweet not found or unauthorized");
  }

  return res.status(200).json(
    new ApiResponse(200, {}, "Tweet deleted successfully")
  );
});

export {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
};
