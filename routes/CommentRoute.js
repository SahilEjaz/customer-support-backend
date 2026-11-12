import express from "express"
import {addComment, getComments} from "../controllers/CommentController.js"
import {protect} from "../midleware/AuthMiddleware.js"


const router = express.Router()

router.post("/:id", protect, addComment)
router.get("/:id", protect, getComments)

export default router