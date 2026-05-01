import express from "express"
import * as postController from "./post.controller.js"

const router = express.Router()

router.post("/",postController.create)
router.delete("/:postId",postController.deletePost)
router.get("/details",postController.getDetails)
router.get("/comment-count",postController.getCommentCount)

export default router