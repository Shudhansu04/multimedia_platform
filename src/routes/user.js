import Router from "express";
import { registerUser, loginUser, loggedOutUser, refreshAccessToken } from "../controllers/user.js";
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


router.route("/logout").post(verifyJWT, loggedOutUser)


router.route("/refresh-token").post(refreshAccessToken)







export default router