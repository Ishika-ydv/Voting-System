import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

/* ================= TOKEN GENERATION ================= */
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (err) {
    console.log("TOKEN ERROR:", err);
    throw new ApiError(500, "Error generating tokens");
  }
};

/* ================= COOKIE OPTIONS ================= */
const cookieOptions = {
  httpOnly: true,
  secure: true,        // REQUIRED for HTTPS (Render + Vercel)
  sameSite: "none",    // 🔥 FIX: allows cross-origin cookies
};

/* ================= REGISTER ================= */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, organization } = req.body;

  if (
    [name, email, password, role, organization].some(
      (field) => !field || field.toString().trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    name,
    email,
    role,
    password,
    organization,
  });

  const createdUser = await User.findById(user._id).select("-password");

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

/* ================= SEND OTP ================= */
const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  const otp = Math.floor(100000 + Math.random() * 900000);

  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  await sendEmail(email, "Verify Your Account", `Your OTP is: ${otp}`);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "OTP sent successfully"));
});

/* ================= VERIFY OTP ================= */
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  if (String(user.otp) !== String(otp)) {
    throw new ApiError(400, "Invalid OTP");
  }

  if (user.otpExpires < Date.now()) {
    throw new ApiError(400, "OTP expired");
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpires = null;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User verified successfully"));
});

/* ================= LOGIN ================= */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

  if (!user.isVerified) {
    throw new ApiError(403, "Please verify your email first");
  }

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user._id);

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
        "Login successful"
      )
    );
});

/* ================= REFRESH TOKEN ================= */
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedToken.sub);

  if (!user || incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user._id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, { accessToken }, "Token refreshed"));
});

/* ================= GET CURRENT USER ================= */
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched"));
});

/* ================= LOGOUT ================= */
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $unset: { refreshToken: 1 },
  });

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

/* ================= EXPORTS ================= */
export {
  registerUser,
  loginUser,
  refreshAccessToken,
  sendOtp,
  verifyOtp,
  changeCurrentPassword,
  updateAccountDetails,
  getCurrentUser,
  logoutUser,
};