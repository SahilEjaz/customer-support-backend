import express from "express"
import { getAgents } from "../controllers/UserController.js"
import { protect } from "../midleware/AuthMiddleware.js"
import { authorizeRole } from "../midleware/RoleMiddleware.js"


const router = express.Router()
 
router.get("/agents", protect, authorizeRole("AGENT"), getAgents)
 
export default router