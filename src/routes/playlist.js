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

/**
 * @swagger
 * tags:
 *   name: Playlists
 *   description: Playlist management routes
 */

/**
 * @swagger
 * /playlists:
 *   post:
 *     summary: Create a new playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Playlist created successfully
 */
router.post("/", verifyJWT, createPlaylist);

/**
 * @swagger
 * /playlists/user/{userId}:
 *   get:
 *     summary: Get all playlists of a user
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of user playlists
 */
router.get("/user/:userId", verifyJWT, getUserPlaylists);

/**
 * @swagger
 * /playlists/{playlistId}:
 *   get:
 *     summary: Get playlist by ID
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *         description: Playlist ID
 *     responses:
 *       200:
 *         description: Playlist fetched successfully
 */
router.get("/:playlistId", verifyJWT, getPlaylistById);

/**
 * @swagger
 * /playlists/add/{playlistId}/{videoId}:
 *   patch:
 *     summary: Add a video to a playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video added to playlist
 */
router.patch("/add/:playlistId/:videoId", verifyJWT, addVideoToPlaylist);

/**
 * @swagger
 * /playlists/remove/{playlistId}/{videoId}:
 *   patch:
 *     summary: Remove a video from a playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video removed from playlist
 */
router.patch("/remove/:playlistId/:videoId", verifyJWT, removeVideoFromPlaylist);

/**
 * @swagger
 * /playlists/{playlistId}:
 *   delete:
 *     summary: Delete a playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Playlist deleted
 */
router.delete("/:playlistId", verifyJWT, deletePlaylist);

/**
 * @swagger
 * /playlists/{playlistId}:
 *   patch:
 *     summary: Update playlist details
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Playlist updated successfully
 */
router.patch("/:playlistId", verifyJWT, updatePlaylist);

export default router;
