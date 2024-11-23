import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  resetPassword,
  forgotPassword,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(upload.single("pic"), registerUser);

router.route("/login").post(loginUser);

router.route("/logoutUser").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/forgot-password").post(forgotPassword);

router.route("/reset-password/:id").post(resetPassword);

router.route("/change-password").post(verifyJWT, changeCurrentPassword);

router.route("/currenr-user").get(verifyJWT, getCurrentUser);

router.route("/update-account").patch(verifyJWT, updateAccountDetails);

export default router;
