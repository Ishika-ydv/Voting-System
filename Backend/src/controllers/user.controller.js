import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

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
  

   const {name, email, password, organization} = req.body;
//    console.log("email:", email);
//    console.log("name:", name);
//    console.log("password:", password)

    if(
        [name, email, password, organization].some(
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


export{
    registerUser,
    loginUser,
    refreshAccessToken

}