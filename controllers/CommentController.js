import mongoose from "mongoose"
import Comment from "../models/comment.js"
import Ticket from "../models/Ticket.js"


const canAccessTicket = (ticket, user) => {
    if (user.role === "AGENT") return true
    return ticket.customer.toString() === user._id.toString()
}
 

export const addComment = async (req, res) => {
    try {
        const { id } = req.params
        const { message } = req.body
 
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ticket id" })
        }
 
        if (!message || message.trim() === "") {
            return res.status(400).json({ message: "Message is required" })
        }
 
        const ticket = await Ticket.findById(id)
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" })
        }
 
        if (!canAccessTicket(ticket, req.user)) {
            return res.status(403).json({ message: "You cannot comment on this ticket" })
        }
 
        if (ticket.status === "CLOSED") {
            return res.status(400).json({ message: "This ticket is closed" })
        }
 
        const comment = await Comment.create({
            ticket: id,
            user: req.user._id,
            message,
        })
 
        
        await Ticket.findByIdAndUpdate(id, { updatedAt: new Date() })
 
        const savedComment = await comment.populate("user", "name role")
 
        res.status(201).json(savedComment)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}
 

export const getComments = async (req, res) => {
    try {
        const { id } = req.params
 
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ticket id" })
        }
 
        const ticket = await Ticket.findById(id)
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" })
        }
 
        if (!canAccessTicket(ticket, req.user)) {
            return res.status(403).json({ message: "You cannot view this conversation" })
        }
 
        
        const comments = await Comment.find({ ticket: id })
            .populate("user", "name role")
            .sort({ createdAt: 1 })
 
        res.status(200).json(comments)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}
 