import express from "express"
import * as authService from "./auth.service.js";

const router = express.Router()

router.post("/signup",authService.signup)

router.post("/login",authService.login)

router.post("/refresh-token",authService.refreshToken)

router.post("/social-login",authService.loginWithGoogle)

export default router