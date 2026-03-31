import Chat from "../models/Chat.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken"

//generate token using jwt
const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'30d'})
}


//Api to register a user POST
export const registerUser= async(req,res)=>{
    const{name,email,password} = req.body;
    try {
        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(401).json({success:false, message:"user already exists"});
        }
        const user = await User.create({name,email,password}) 
        const token = generateToken(user._id)
        res.status(201).json({success:true,token})
    } catch (error) {
        res.status(401).json({success:false,message:error.message})
    }
}
//Api to login a user POST
export const loginUser= async(req,res)=>{
    const{email,password}= req.body;
    try {
        const user= await User.findOne({email})
        if(user){
            const isMatch= await bcrypt.compare(password,user.password);
            if(isMatch){
                const token = generateToken(user._id);
                return res.status(201).json({success:true,token})
            }
        
        }
        return res.status(401).json({success:false,message:"invalid username or password"})
    } catch (error) {
        return res.status(501).json({success:false,message:error.message})
    }
}

//api to get user data (we check user using authMiddleware) GET
export const getUserData = async(req,res)=>{
    try {
        const user= req.user;
        return res.status(200).json({success:true,user})
    } catch (error) {
        return res.status(401).json({success:false,message:error.message})
    }
}

//api to get published images
export const getPublishedImages= async(req,res)=>{
    try {
        const publishedImageMessages= await Chat.aggregate([
            {$unwind:"$messages"},
            {$match:{
                "messages.isImage":true,
                "messages.isPublished":true
            }},
            {$project:{
                _id:0,
                imageUrl:"$messages.content",
                userName:"$userName"
            }}
        ])

        res.status(201).json({success:true,images:publishedImageMessages.reverse()})
    } catch (error) {
        return res.status(401).json({success:false,message:error.message});
    }
}