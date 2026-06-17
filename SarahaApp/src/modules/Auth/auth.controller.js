import express from "express"
import * as authService from "./auth.service.js";

const router = express.Router()

router.post("/signup",authService.signup)

router.post("/login",authService.login)

router.post("/refresh-token",authService.refreshToken)

export default router