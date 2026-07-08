import express from "express"
import connectDB from "./DB/connection.js"
import { globalErrorHandler, NotFoundException } from "./utils/response/error.response.js"
import authRouter from "./modules/Auth/auth.controller.js"
import userRouter from "./modules/User/user.controller.js"
import cors from "cors"
import helmet from "helmet"
import { corsOptions } from "./utils/cors/cors.utils.js"
const app = express()

app.use(express.json())
app.use(cors(corsOptions()))
app.use(helmet())

await connectDB()
app.use("/auth",authRouter)
app.use("/user",userRouter)

app.all("/*dummy",(req,res)=>{
    throw NotFoundException({messaage:"Not found Handler!!"})
})

app.use(globalErrorHandler)

export default app
