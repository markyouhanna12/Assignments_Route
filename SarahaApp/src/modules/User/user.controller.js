import express from "express"
import * as userService from "./user.service.js";

const router = express.Router()

router.get("/",userService.getProfile)

export default router