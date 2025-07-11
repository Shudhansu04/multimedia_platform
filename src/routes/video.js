import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
} from "../controllers/video.js";
import { verifyJWT } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";

const router = Router();

router.use(verifyJWT);

/**
 * @swagger
 * tags:
 *   name: Videos
 *   description: Video management and publishing
 */

/**
 * @swagger
 * /videos:
 *   get:
 *     summary: Get all videos with filters, pagination, and sorting
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: sortType
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Videos fetched successfully
 *
 *   post:
 *     summary: Publish a new video
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - videoFile
 *               - thumbnail
 *               - title
 *               - description
 *               - duration
 *             properties:
 *               videoFile:
 *                 type: string
 *                 format: binary
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: number
 *     responses:
 *       201:
 *         description: Video published successfully
 */
router
    .route("/")
    .get(getAllVideos)
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
        ]),
        publishAVideo
    );

/**
 * @swagger
 * /videos/{videoId}:
 *   get:
 *     summary: Get a video by ID
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video fetched successfully
 *       404:
 *         description: Video not found
 *
 *   patch:
 *     summary: Update a video
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Video updated successfully
 *       404:
 *         description: Video not found
 *
 *   delete:
 *     summary: Delete a video
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video deleted successfully
 *       404:
 *         description: Video not found
 */
router
    .route("/:videoId")
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);

/**
 * @swagger
 * /videos/toggle/publish/{videoId}:
 *   patch:
 *     summary: Toggle publish status of a video
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the video
 *     responses:
 *       200:
 *         description: Video publish status toggled
 *       404:
 *         description: Video not found
 */
router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router;
