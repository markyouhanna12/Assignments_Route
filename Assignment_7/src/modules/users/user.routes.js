import express from "express";
import * as userController from "./user.controller.js"

const router = express.Router()

router.post("/signup",userController.signup)
router.put("/:id",userController.updateUser)
router.get("/by-email",userController.getByEmail)
router.get("/:id",userController.getById)

export default router