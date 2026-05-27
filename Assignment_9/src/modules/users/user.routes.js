import express from "express"
import authMiddleware from "../../middlewares/auth.middleware.js"
import{signup,login,getUser,updateUser,deleteUser} from "../../modules/users/user.controller.js"

const router = express.Router()

router.post("/signup",signup)
router.post("/login",login)
router.get("/", authMiddleware, getUser);
router.patch("/",authMiddleware,updateUser)
router.delete("/",authMiddleware,deleteUser)

export default router;