import express from "express"
import * as userService from "./user.service.js";
import { RoleEnum, TokenTypeEnum } from "../../utils/enums/user.enum.js";
import { authentication, authorization } from "../../middlewares/Auth.middleware.js";

const router = express.Router()

router.get("/",
    authentication({tokenType:TokenTypeEnum.Access}),
    authorization({accessRoles:[RoleEnum.User]}),
    userService.getProfile)

export default router