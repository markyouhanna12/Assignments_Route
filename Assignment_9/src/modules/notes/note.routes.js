import express from "express"
import authMiddleware from "../../middlewares/auth.middleware.js"
import {createNote,
    updateSingleNote,
    replaceNote,
    updateAllTitles,
    deleteSingleNote,
    paginateNotes,
    getSingleNote,
    getNoteByContent,
    getNotesWithUser,
    aggregateNotes,
    deleteAllNotes} from "./note.controller.js"


const router = express.Router()


router.post("/",authMiddleware,createNote)

router.patch("/all",authMiddleware,updateAllTitles)

router.put("/replace/:noteId", authMiddleware, replaceNote)

router.get("/paginate-sort", authMiddleware, paginateNotes);

router.get("/note-by-content", authMiddleware, getNoteByContent);

router.get("/note-with-user", authMiddleware, getNotesWithUser);

router.get("/aggregate", authMiddleware, aggregateNotes);

router.get("/:id", authMiddleware, getSingleNote);

router.patch("/:noteId", authMiddleware, updateSingleNote)

router.delete("/:noteId", authMiddleware, deleteSingleNote);

router.delete("/", authMiddleware, deleteAllNotes);

export default router
