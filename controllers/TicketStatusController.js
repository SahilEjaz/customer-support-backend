import Ticket from "../models/Ticket.js"


const STATUSES = ["OPEN", "IN_PROGRESS", "WAITING_FOR_CUSTOMER", "RESOLVED", "CLOSED"]
const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"]
const CATEGORIES = ["Technical Issue", "Billing", "Account", "Feature Request", "General"]

const countBy = async (field, values, filter) => {
    const result = {}
 
    for (const value of values) {
        result[value] = await Ticket.countDocuments({ ...filter, [field]: value })
    }
 
    return result
}


export const getTicketStats = async (req, res) => {
    try {
        const filter = req.user.role === "CUSTOMER" ? { customer: req.user._id } : {}
 
        const total = await Ticket.countDocuments(filter)
        const byStatus = await countBy("status", STATUSES, filter)
        const byPriority = await countBy("priority", PRIORITIES, filter)
        const byCategory = await countBy("category", CATEGORIES, filter)
 
        res.status(200).json({ total, byStatus, byPriority, byCategory })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}