import express from "express"
import connectDB from "./DB/connection.js"
import { successResponse } from "./utils/response/success.response.js"
import { globalErrorHandler, NotFoundException } from "./utils/response/error.response.js"

const app = express()

app.use(express.json())
await connectDB()
// app.use("/auth",authRouter)

app.all("/*dummy",(req,res)=>{
    throw NotFoundException({messaage:"Not found Handler!!"})
})

app.use(globalErrorHandler)

export default app
