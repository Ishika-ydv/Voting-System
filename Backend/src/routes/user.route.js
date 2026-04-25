import { Router } from "express";
import { registerUser, loginUser, refreshAccessToken, sendOtp, verifyOtp} from "../controllers/user.controller.js";
import { verifyJWT, verifyRole} from "../middlewares/auth.middleware.js";

const router = Router();



router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

// 📧 OTP ROUTES
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);



export default router;