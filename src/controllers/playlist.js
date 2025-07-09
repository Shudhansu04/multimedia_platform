import mongoose from "mongoose";
import { Playlist } from "../models/playlist.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        throw new ApiError(400, "Playlist name is required");
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id,
        videos: [],
    });

    return res
        .status(201)
        .json(new ApiResponse(201, playlist, "Playlist created successfully"));
});


const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const playlists = await Playlist.find({ owner: userId }).populate("videos");

    return res
        .status(200)
        .json(new ApiResponse(200, playlists, "User playlists fetched"));
});


const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    const playlist = await Playlist.findById(playlistId)
        .populate("videos")
        .populate("owner", "username fullname");

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});


const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) throw new ApiError(404, "Playlist not found");

    if (!playlist.videos.includes(videoId)) {
        playlist.videos.push(videoId);
        await playlist.save();
    }

    return res.status(200).json(
        new ApiResponse(200, playlist, "Video added to playlist")
    );
});


const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) throw new ApiError(404, "Playlist not found");

    playlist.videos = playlist.videos.filter(
        (vid) => vid.toString() !== videoId
    );
    await playlist.save();

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Video removed from playlist"));
});


const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    const deleted = await Playlist.findByIdAndDelete(playlistId);

    if (!deleted) {
        throw new ApiError(404, "Playlist not found or already deleted");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Playlist deleted successfully"));
});


const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    const updated = await Playlist.findByIdAndUpdate(
        playlistId,
        { $set: { name, description } },
        { new: true }
    );

    if (!updated) {
        throw new ApiError(404, "Playlist not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updated, "Playlist updated successfully"));
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
};
