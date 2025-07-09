import { Like } from "../models/like.js";
import ApiError from "../utils/ApiError.js";
import  ApiResponse  from "../utils/ApiResponse.js";
import  asyncHandler  from "../utils/asyncHandler.js";

 
const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id,
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new ApiResponse(200, {}, "Video unliked"));
    }

    const like = await Like.create({
        video: videoId,
        likedBy: req.user._id,
    });

    return res.status(200).json(new ApiResponse(200, like, "Video liked"));
});

 
const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const existingLike = await Like.findOne({
        Comment: commentId,
        likedBy: req.user._id,
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new ApiResponse(200, {}, "Comment unliked"));
    }

    const like = await Like.create({
        Comment: commentId,
        likedBy: req.user._id,
    });

    return res.status(200).json(new ApiResponse(200, like, "Comment liked"));
});

 
const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id,
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new ApiResponse(200, {}, "Tweet unliked"));
    }

    const like = await Like.create({
        tweet: tweetId,
        likedBy: req.user._id,
    });

    return res.status(200).json(new ApiResponse(200, like, "Tweet liked"));
});

 
const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideos = await Like.find({
        likedBy: req.user._id,
        video: { $ne: null }
    }).populate("video");

    return res.status(200).json(new ApiResponse(200, likedVideos.map(l => l.video), "Liked videos fetched"));
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
};
