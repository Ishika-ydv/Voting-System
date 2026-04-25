import { Router } from "express";
import { registerUser, loginUser, refreshAccessToken, sendOtp, verifyOtp,updateAccountDetails, getCurrentUser,changeCurrentPassword,logoutUser} from "../controllers/user.controller.js";
import { verifyJWT, verifyRole} from "../middlewares/auth.middleware.js";

const router = Router();



router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);
router.patch(
  "/update-profile",
  verifyJWT,
  updateAccountDetails
);

router.post("/logout", verifyJWT, logoutUser);
router.get("/me", verifyJWT, getCurrentUser);
router.post("/change-password", verifyJWT, changeCurrentPassword);

// 📧 OTP ROUTES
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);





export default router;