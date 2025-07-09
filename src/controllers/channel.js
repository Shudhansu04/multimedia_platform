import mongoose from "mongoose";
import { Video } from "../models/video.js";
import { Subscription } from "../models/subscription.js";
import { Like } from "../models/like.js";
import  ApiError  from "../utils/ApiError.js";
import  ApiResponse  from "../utils/ApiResponse.js";
import  asyncHandler  from "../utils/asyncHandler.js";

 
const getChannelStats = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

 
  const totalVideos = await Video.countDocuments({ owner: userId });

  
  const viewsAgg = await Video.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalViews: { $sum: "$views" }
      }
    }
  ]);
  const totalViews = viewsAgg[0]?.totalViews || 0;

   
  const totalSubscribers = await Subscription.countDocuments({ channel: userId });

 
  const totalLikes = await Like.countDocuments({ likedBy: userId });

  return res.status(200).json(
    new ApiResponse(200, {
      totalVideos,
      totalViews,
      totalSubscribers,
      totalLikes
    }, "Channel stats fetched successfully")
  );
});
 
const getChannelVideos = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const videos = await Video.find({ owner: userId })
    .sort({ createdAt: -1 })
    .select("title description thumbnail views createdAt duration");

  return res.status(200).json(
    new ApiResponse(200, videos, "Channel videos fetched successfully")
  );
});

export {
  getChannelStats,
  getChannelVideos
};
