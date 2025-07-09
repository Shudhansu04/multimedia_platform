import express from "express";
import { verifyJWT } from "../middlewares/auth.js";
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
} from "../controllers/playlist.js";

const router = express.Router();

router.post("/", verifyJWT, createPlaylist);
router.get("/user/:userId", verifyJWT, getUserPlaylists);
router.get("/:playlistId", verifyJWT, getPlaylistById);
router.patch("/add/:playlistId/:videoId", verifyJWT, addVideoToPlaylist);
router.patch("/remove/:playlistId/:videoId", verifyJWT, removeVideoFromPlaylist);
router.delete("/:playlistId", verifyJWT, deletePlaylist);
router.patch("/:playlistId", verifyJWT, updatePlaylist);

export default router;
