import { Router } from 'express';
import {
    getChannelStats,
    getChannelVideos,
} from "../controllers/channel.js"
import {verifyJWT} from "../middlewares/auth.js"

const router = Router();

router.use(verifyJWT);  

router.route("/stats").get(getChannelStats);
router.route("/videos").get(getChannelVideos);

export default router