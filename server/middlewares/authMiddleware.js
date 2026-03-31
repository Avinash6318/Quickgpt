import jwt from "jsonwebtoken"
import User from "../models/User.js";

export const protect = async(req, res, next)=>{
    let token= req.headers.authorization;
    try{
        const decoded= jwt.verify(token,process.env.JWT_SECRET);
        const userId = decoded.id;
        const user= await User.findById(userId);
        if(!user){
            return res.status(400).json({success:false,message:"user not authorized, user not found"})
        }
        req.user=user;
        next()
        // console.log("middleware hit");
    }catch(error){
        return res.status(500).json({success:false,message:"not authorized, token failed"})

    }
}