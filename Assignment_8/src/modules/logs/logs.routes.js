import express from "express"
import { insertLog } from "./logs.controller.js"

const router = express.Router()

//http://localhost:3000/logs/
router.post("/",insertLog)


export default router