import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import ConnectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import creditRouter from "./routes/creditRoutes.js";
import { stripeWebhooks } from "./controllers/webhook.js";

dotenv.config()
const app = express();
await ConnectDB()

//stripe webhook
app.post('/api/stripe', express.raw({type:'application/json'}),stripeWebhooks)


//middleware
app.use(cors())
app.use(express.json())

const PORT=process.env.PORT||3500;
//routes
app.get('/',(req,res)=>{
    res.send("server created and in use")
})
app.use('/api/user',userRouter)
app.use('/api/chat',chatRouter)
app.use('/api/message',messageRouter)
app.use('/api/credit',creditRouter)

app.listen(PORT,()=>{console.log(`server running successfully on port ${PORT}`)});

