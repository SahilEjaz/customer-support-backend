import express from "express"
import { createTicket, getTickets, getTicketById } from "../controllers/TicketController.js"
import { updateStatus, updatePriority, assignTicket, closeTicket } from "../controllers/TicketActionController.js"
import { getTicketStats } from "../controllers/TicketStatusController.js"
import {protect} from "../midleware/AuthMiddleware.js"
import {authorizeRole}from "../midleware/RoleMiddleware.js"


const router =express.Router()

// any logged-in user
router.get("/stats", protect, getTicketStats)
router.get("/", protect, getTickets)
router.get("/:id", protect, getTicketById)

// customer only
router.post("/", protect, authorizeRole("CUSTOMER"), createTicket)
router.put("/:id/close", protect, authorizeRole("CUSTOMER"), closeTicket)

// agent only
router.put("/:id/status", protect, authorizeRole("AGENT"), updateStatus)
router.put("/:id/priority", protect, authorizeRole("AGENT"), updatePriority)
router.put("/:id/assign", protect, authorizeRole("AGENT"), assignTicket)


export default router