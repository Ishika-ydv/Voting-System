import express, { urlencoded } from "express";
import cors from"cors";
import cookieParser from "cookie-parser";
import { ApiError } from "./utils/ApiError.js";
const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())



//routes import

import userRouter from "../src/routes/user.route.js"
import pollRouter from "../src/routes/poll.route.js"
import voteRoutes from "../src/routes/vote.route.js";



//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/polls", pollRouter)
app.use("/api/v1/votes", voteRoutes);


// app.use((err, req, res, next) => {
//   if (err instanceof ApiError) {
//     return res.status(err.statusCode).json({
//       success: false,
//       message: err.message,
//       errors: err.errors,
//     });
//   }

//   // Unknown errors
//   return res.status(500).json({
//     success: false,
//     message: "Internal Server Error",
//   });
// });




export {app}