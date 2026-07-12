import express from "express"
import * as messageService from "./message.service.js"
import {authentication , authorization} from "../../middlewares/Auth.middleware.js"
import {validation} from "../../middlewares/Validation.middleware.js"
import { sendMessageValidation } from "./message.validation.js"
import { RoleEnum, TokenTypeEnum } from "../../utils/enums/user.enum.js"

const router = express.Router()

router.post("/send-message/:receiverId",
    validation(sendMessageValidation),
    messageService.sendMessage
)

router.get("/get-messages-admin",
    authentication({tokenType : TokenTypeEnum.Access}),
    authorization({accessRoles : [RoleEnum.Admin]}),
    messageService.getMessagesAdmin
)

router.get("/get-messages" ,
    authentication({tokenType : TokenTypeEnum.Access}),
    authorization({accessRoles : [RoleEnum.User]}),
    messageService.getMessages
)

export default router