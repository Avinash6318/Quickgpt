import imagekit from "../config/imagekit.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";


//text based AI chat message controller
export const textMessageController = async(req,res)=>{
    try {
        const userId = req.user._id;

         //check credits
        if(req.user.credits<1){
            return res.status(401).json({success:false,message:"you dont have enough credit to use this feature"})
        }

        const{chatId,prompt}= req.body;
        const chat = await Chat.findOne({userId,_id:chatId})
        Chat.messages.push({role:"user",content:prompt,timestamp:Date.now(), isImage:false}) 

        const {choices} = await openai.chat.completions.create({
          model: "gemini-3-flash-preview",
          messages: [
               {
                   role: "user",
                   content: prompt,
               },
            ],
        });

        const reply={...choices[0].message,timestamp:Date.now(), isImage:false}
        chat.messages.push(reply);
        await chat.save()

        await User.updateOne({_id:userId},{$inc:{credits:-1}})
        res.status(201).json({success:true,reply})

    } catch (error) {
        res.status(401).json({success:false,message:error.message})
        
    }
}

//Image generation message controller
export const imageMessageController= async(req,res)=>{
    try {
        const userId=req.user._id;

        //check credits
        if(req.user.credits<2){
            return res.status(401).json({success:false,message:"you dont have enough credit to use this feature"})
        }
        const {prompt,chatId,isPublished}=req.body;

        //find chhat
        const chat= await chat.findOne({userId,_id:chatId})

        //push user message
        chat.messages.push({role:"user",content:prompt,timestamp:Date.now(),isImage:false});

        //encode the prompt
        const encodedPrompt = encodeURIComponent(prompt)

        //construct imagekit Ai generation URL
        const generatedImageUrl= `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/
        Quickgpt/${Date.now()}.png?tr=w-800,h-800`;

        const aiImageResponse= await axios.get(generatedImageUrl,{responseType: "arraybuffer"})

        //convert to Base64
        const base64Image=`data:image/png; base64,${Buffer.from(aiImageResponse.data, "binary").toString('base64')}`;

        //upload to imagekit media library
        const uploadResponse = await imagekit.upload({
            file:base64Image,
            filename:`${Date.now()}.png`,
            folder:"Quickgpt"
        })

        const reply ={
            role:'assistent',
            content:uploadResponse.url,
            timestamp : Date.now(),
            isImage:true,
            isPublished
        } 
        res.status(201).json({success:true,reply});
        chat.messages.push(reply)
        await chat.save();

        await User.updateOne({_id:userId},{$inc:{credits:-2}})
    } catch (error) {
         res.status(401).json({success:false,message:error.message})
        
    }
}