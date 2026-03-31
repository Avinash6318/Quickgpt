import mongoose from "mongoose";

const ConnectDB= async()=>{
    try {
        mongoose.connection.on("connected",()=>{console.log("database connected")});
        mongoose.connection.on("error", (err) => {console.log("MongoDB error:", err);});
        await mongoose.connect(`${process.env.MONGO_URI}/Quickgpt`);
    } catch (error) {
        console.log(error.message)
    }
}

export default ConnectDB