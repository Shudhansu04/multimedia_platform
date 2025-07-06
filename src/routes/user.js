import Router from "express";
import { registerUser, loginUser, loggedOutUser, refreshAccessToken,changeCurrentPassword,getCurrentUser ,updateAccountDetails,updateAvatar,updateCoverImage,getUserChannelProfile,getWatchHistory} from "../controllers/user.js";
import { upload } from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/auth.js"

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

router.route("/refresh-token").post(refreshAccessToken)

//secure routes

router.route("/logout").post(verifyJWT, loggedOutUser)

router.route("/change-password").post(verifyJWT,changeCurrentPassword)

router.route("/current-user").get(verifyJWT,getCurrentUser)

router.route("/update-account").patch(verifyJWT,updateAccountDetails)

router.route("/avatar-update").patch(verifyJWT,upload.single("avatar"),updateAvatar)

router.route("/cover-image-update").patch(verifyJWT,upload.single("coverImage"),updateCoverImage)

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)

router.route("/watch-history").get(verifyJWT, getWatchHistory)


export default router