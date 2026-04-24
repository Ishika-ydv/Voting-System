import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String, 
            required: true 
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
        },

        password: {
             type: String, 
             required: true 
        },

        refreshToken: {
            type: String
        },

        role: {
            type: String,
            enum: ["voter", "admin", "superadmin"],
            default: "voter",
            index: true,
        },

        isVerified: {
            type: Boolean, 
            default: false 
        },

        organization: {
            type: String,
            required: true,
            index: true,
        },

        votedPolls: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Poll",
            },
        ],

        createdAt: { 
            type: Date, 
            default: Date.now 
        },

        lastLoginAt: {
             type: Date 
        }
},{timestamps: true});



//HASH PASSWORD BEFORE SAVE
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
  //next();
});

// CHECK PASSWORD
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//GENERATE ACCESS TOKEN
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      sub: this._id,             // standard
      email: this.email,
      role: this.role,
      org: this.organization,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

//GENERATE REFRESH TOKEN
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      sub: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

// Compound index
userSchema.index({ organization: 1, role: 1 });




const User= mongoose.model("User", userSchema);
export {User}