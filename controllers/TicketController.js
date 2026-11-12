import mongoose from "mongoose"
import Ticket from "../models/Ticket.js"


export const createTicket = async (req, res) => {
    try {
        const { title, description, category, priority } = req.body
 
        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required" })
        }
 
        const ticket = await Ticket.create({
            title,
            description,
            category,
            priority,
            customer: req.user._id,
        })
 
        res.status(201).json(ticket)
    } catch (error) {
       
        res.status(400).json({ message: "Could not create ticket", error: error.message })
    }
}
 

export const getTickets = async (req, res) => {
    try {
        const { status, priority, category, search, assigned, sort } = req.query
 
        const page = Math.max(1, Number(req.query.page) || 1)
        const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10))
 
        const filter = {}
 
       
        if (req.user.role === "CUSTOMER") {
            filter.customer = req.user._id
        }
 
        if (status) filter.status = status
        if (priority) filter.priority = priority
        if (category) filter.category = category
 
        if (req.user.role === "AGENT") {
            if (assigned === "me") filter.assignedAgent = req.user._id
            if (assigned === "none") filter.assignedAgent = null
        }
 
        if (search) {
        
            const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
            filter.title = { $regex: safeSearch, $options: "i" }
        }
 
        const sortOrder = sort === "oldest" ? 1 : -1
 
        const total = await Ticket.countDocuments(filter)
 
        const tickets = await Ticket.find(filter)
            .populate("customer", "name email")
            .populate("assignedAgent", "name email")
            .sort({ createdAt: sortOrder })
            .skip((page - 1) * limit)
            .limit(limit)
 
        res.status(200).json({
            tickets,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}
 

export const getTicketById = async (req, res) => {
    try {
        const { id } = req.params
 
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ticket id" })
        }
 
        const ticket = await Ticket.findById(id)
            .populate("customer", "name email")
            .populate("assignedAgent", "name email")
 
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" })
        }
 
        
        if (
            req.user.role === "CUSTOMER" &&
            ticket.customer._id.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: "You cannot view this ticket" })
        }
 
        res.status(200).json(ticket)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}
 