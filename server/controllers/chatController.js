import Chat from "../models/Chat.js";


//Api controller for creaating a new chat 
export const createChat=async(req,res)=>{
    try {
        const userId=req.user._id;
        const chatData={userId,messages:[],name:"Newchat",userName:req.user.name}
        await Chat.create(chatData)
        res.status(200).json({success:true,message:"chat created"})
    } catch (error) {
        res.status(400).json({success:false,message:error.message})
        
    }
}


//api controller for getting all chats 
export const getChats=async(req,res)=>{
    try {
        const userId=req.user._id;
        const chats =(await Chat.find({userId})).Sort({updatedAt:-1})
        res.status(200).json({success:true,chats})
    } catch (error) {
        res.status(400).json({success:false,message:error.message})
        
    }
}

//api controller for deleting chats
export const deleteChat=async(req,res)=>{
    try {
        const userId=req.user._id;
        const {chatId}=req.body;
        await Chat.deleteOne({_id:chatId,userId})
        res.status(200).json({success:true,message:"chat deleted"})
    } catch (error) {
        res.status(400).json({success:false,message:error.message})
        
    }
}
