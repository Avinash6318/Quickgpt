import express from "express"
import { getPublishedImages, getUserData, loginUser, registerUser } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const userRouter= express.Router();

userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser);
userRouter.get("/data",protect,getUserData);
userRouter.get("/published-images",getPublishedImages)


export default userRouter