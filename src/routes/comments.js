import express from "express";
import {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
} from "../controllers/comment.js";
import { verifyJWT } from "../middlewares/auth.js";

const router = express.Router();

router.route("/:videoId").get(verifyJWT, getVideoComments);
router.route("/:videoId").post(verifyJWT, addComment);
router.route("/:commentId").patch(verifyJWT, updateComment);
router.route("/:commentId").delete(verifyJWT, deleteComment);

export default router;
