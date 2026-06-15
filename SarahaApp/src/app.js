import express from "express"
import connectDB from "./DB/connection.js"
import { globalErrorHandler, NotFoundException } from "./utils/response/error.response.js"
import authRouter from "./modules/Auth/auth.controller.js"
import userRouter from "./modules/User/user.controller.js"

const app = express()

app.use(express.json())
await connectDB()
app.use("/auth",authRouter)
app.use("/user",userRouter)

app.all("/*dummy",(req,res)=>{
    throw NotFoundException({messaage:"Not found Handler!!"})
})

app.use(globalErrorHandler)

export default app
