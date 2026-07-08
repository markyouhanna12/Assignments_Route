import express from "express"
import * as userService from "./user.service.js";
import { RoleEnum, TokenTypeEnum } from "../../utils/enums/user.enum.js";
import { authentication, authorization } from "../../middlewares/Auth.middleware.js";
import { fileValidation, localFileUpload } from "../../utils/multer/local.multer.js";
import { validation } from "../../middlewares/Validation.middleware.js";
import * as userValidation from "./user.validation.js";

const router = express.Router()

router.get("/",
    authentication({tokenType:TokenTypeEnum.Access}),
    authorization({accessRoles:[RoleEnum.User]}),
    userService.getProfile)



router.patch("/update-profile-pic",
    authentication({tokenType:TokenTypeEnum.Access}),
    authorization({accessRoles:[RoleEnum.User]}),
    localFileUpload({customPath:"User", validation:[...fileValidation.images]}).single("attachments"),
    validation(userValidation.ProfilePicSchema),
    userService.updateProfilePic
)


router.patch("/update-profile-Cover",
    authentication({tokenType:TokenTypeEnum.Access}),
    authorization({accessRoles:[RoleEnum.User]}),
    localFileUpload({customPath:"User", validation:[...fileValidation.images]}).array("attachments",5),
    validation(userValidation.coverImagesSchema),
    userService.updateCoverPic
)

router.patch("/update-password",
    authentication({tokenType:TokenTypeEnum.Access}),
    authorization({accessRoles:[RoleEnum.User , RoleEnum.Admin]}),
    validation(userValidation.updatePasswordSchema),
    userService.updatePassword
)

// freeze by user or admin
router.delete("{/:userId}/freeze-account",
    authentication({tokenType : TokenTypeEnum.Access}),
    authorization({accessRoles : [RoleEnum.Admin , RoleEnum.User]}),
    validation(userValidation.freezeAccountSchema),
    userService.freezeAccount

)

// restore user by admin
router.patch("/:userId/restore-account",
    authentication({tokenType : TokenTypeEnum.Access}),
    authorization({accessRoles : [RoleEnum.Admin]}),
    validation(userValidation.restoreAccountSchema),
    userService.restoreAccount
)

// hard delete user by admin only
router.delete("/:userId/hard-delete",
    authentication({tokenType: TokenTypeEnum.Access}),
    authorization({accessRoles: [RoleEnum.Admin]}),
    validation(userValidation.hardDeleteAccountSchema),
    userService.hardDeleteAccount
)

export default router