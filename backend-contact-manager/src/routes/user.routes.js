import {Router} from "express"
import { registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails } from "../controllers/user.controller.js"
    import {verifyJWT} from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

    const userRouter = Router()

    userRouter.route("/register").post(upload.single("pic"), registerUser)

    userRouter.route("/login").post(loginUser)

    userRouter.route("/logoutUser").post(verifyJWT, logoutUser)

    userRouter.route("/refresh-token").post(refreshAccessToken)

    userRouter.route("/change-password").post(verifyJWT, changeCurrentPassword)

    userRouter.route("/currenr-user").get(verifyJWT, getCurrentUser)

    userRouter.route("/update-account").patch(verifyJWT, updateAccountDetails)

    export default userRouter