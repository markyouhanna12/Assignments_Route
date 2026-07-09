import express from "express"
import * as authService from "./auth.service.js";
import { validation } from "../../middlewares/Validation.middleware.js";
import * as authValidation from "./auth.validation.js"
import { authentication } from "../../middlewares/Auth.middleware.js";
import { TokenTypeEnum } from "../../utils/enums/user.enum.js";

const router = express.Router()

router.post("/signup",
    validation(authValidation.signupSchema),authService.signup)

router.post("/login",
    validation(authValidation.loginSchema),authService.login)

router.post("/refresh-token"
    ,authService.refreshToken)

router.post("/social-login"
    ,authService.loginWithGoogle)

router.patch("/confirm-email",
    validation(authValidation.confirmEmailSchema),
    authService.confirmEmail)

router.patch("/forget-password",
    validation(authValidation.sendOtpSchema),
    authService.forgetPassword)


router.patch("/reset-password",
    validation(authValidation.resetPasswordSchema),
    authService.resetPassword)


router.post("/logout-with-Redis",
    authentication({tokenType:TokenTypeEnum.Access})
    ,authService.logoutWithRedis)


export default router