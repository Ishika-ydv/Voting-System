import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

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
    console.log("TOKEN ERROR:", err)
    throw new ApiError(500, "Error generating tokens");
  }
};



const registerUser = asyncHandler(async (req,res) =>{                               
  

   const {name, email, password,role, organization} = req.body;
//    console.log("email:", email);
//    console.log("name:", name);
//    console.log("password:", password)

    if(
        [name, email, password, role, organization].some(
      (field) => !field || field.toString().trim() === ""
    )
    ){
        throw new ApiError(400, "All fields are required");
    }
     //console.log("password:", password)

    const existedUser = await User.findOne(
        {email}
    )

    if(existedUser){
        throw new ApiError(409, "User with email or username already exists");
    }

    const user = await User.create({
        name,
        email,
        role,
        password: password,
        organization,
    });

    //console.log(user)

    const CreatedUser = await User.findById(user._id).select(
        "-password" 
    )

    if(!CreatedUser){
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200,CreatedUser, "User registered successfully")
    )


});


const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 min

  await user.save({ validateBeforeSave: false });

  await sendEmail(
    email,
    "Verify Your Account",
    `Your OTP is: ${otp}`
  );

  return res.status(200).json(
    new ApiResponse(200, {}, "OTP sent to email")
  );
});


const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

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

  return res.status(200).json(
    new ApiResponse(200, {}, "User verified successfully")
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //  Validation
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }
  
  // Find user
  const user = await User.findOne({ email });
  console.log(user)

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  //  Check password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }
  
  if (!user.isVerified) {
  throw new ApiError(403, "Please verify your email first");
  }
  // Generate tokens (pass user directly)
  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user._id);

 // Update last login
  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });



  // Cookie options
  const options = {
    httpOnly: true,
    secure: true,        // set false in local dev if needed
    sameSite: "strict",
  };

  // ✅ Response
   return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
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
          accessToken,
        },
        "User logged in successfully"
      )
    );
});


const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    // ✅ Verify token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // ✅ Use 'sub' instead of _id
    const user = await User.findById(decodedToken.sub);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    // ✅ Check token matches DB
    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token expired or already used");
    }

    // ✅ Generate new tokens
    const { accessToken, refreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken },
          "Access token refreshed successfully"
        )
      );

  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});


const changeCurrentPassword = asyncHandler( async (req, res) => {
    const {oldPassword, newPassword} = req.body;

    //  Validation
  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old and new password are required");
  }


    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect){
        throw new ApiError(400 , "Invalid Password");

    }


    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Password Changed Successfully")
    )

});


 const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, req.user, "Current user fetched successfully")
  );
});


 const updateAccountDetails = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  // ✅ Validation
  if (!name?.trim() || !email?.trim()) {
    throw new ApiError(400, "Name and email are required");
  }

  // ✅ Update user
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        name,
        email,
      },
    },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(200, user, "Account details updated successfully")
  );
});


 const logoutUser = asyncHandler(async (req, res) => {
  // ✅ remove refresh token from DB
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    { new: true }
  );

  // ✅ cookie options (same as login)
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export{
    registerUser,
    loginUser,
    refreshAccessToken,
    sendOtp,
    verifyOtp,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    logoutUser
    
}