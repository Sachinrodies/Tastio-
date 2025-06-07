import express, { RequestHandler } from "express";
import { checkAuth, forgotPassword, login, logout, resetPassword, signup, updateUserProfile, verifyEmail } from "../Controller/user.controller";
import { isAuthenticated } from "../Middlewares/isAuthenticated";

const router = express.Router();
router.route("/check-auth").get(isAuthenticated, checkAuth);

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/verify-email").post(verifyEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/profile/update").put(isAuthenticated, updateUserProfile);

export default router;
