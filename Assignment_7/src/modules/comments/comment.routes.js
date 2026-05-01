import express from "express"
import * as commentController from "./comment.controller.js"

const router = express.Router()

router.post("/",commentController.blukCreate)
router.patch("/:commentId",commentController.update)
router.post("/find-or-create",commentController.findOrCreate)
router.get("/search",commentController.search)
router.get("/newest/:postId",commentController.newest)
router.get("/details/:id", commentController.getDetails)


export default router