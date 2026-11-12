import mongoose from "mongoose"
import Ticket from "../models/Ticket.js"
import User from "../models/User.js"


const STATUSES = ["OPEN", "IN_PROGRESS", "WAITING_FOR_CUSTOMER", "RESOLVED", "CLOSED"]
const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"]


const findTicket = async (id, res) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid ticket id" })
        return null
    }

    const ticket = await Ticket.findById(id)
    if (!ticket) {
        res.status(404).json({ message: "Ticket not found" })
        return null
    }

    return ticket
}


const sendTicket = async (ticket, res) => {
    const fullTicket = await ticket.populate([
        { path: "customer", select: "name email" },
        { path: "assignedAgent", select: "name email" },
    ])
    res.status(200).json(fullTicket)
}


export const updateStatus = async (req, res) => {
    try {
        
        const { status } = req.body

        if (!STATUSES.includes(status)) {
            return res.status(400).json({ message: `Status must be one of: ${STATUSES.join(", ")}` })
        }

        const ticket = await findTicket(req.params.id, res)
        if (!ticket) return

        ticket.status = status
        await ticket.save()

        await sendTicket(ticket, res)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}


export const updatePriority = async (req, res) => {
    try {
        const { priority } = req.body

        if (!PRIORITIES.includes(priority)) {
            return res.status(400).json({ message: `Priority must be one of: ${PRIORITIES.join(", ")}` })
        }

        const ticket = await findTicket(req.params.id, res)
        if (!ticket) return

        ticket.priority = priority
        await ticket.save()

        await sendTicket(ticket, res)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}


export const assignTicket = async (req, res) => {
    try {
        const { agentId } = req.body

        const ticket = await findTicket(req.params.id, res)
        if (!ticket) return

        let newAgentId = req.user._id

        if (agentId) {
            if (!mongoose.Types.ObjectId.isValid(agentId)) {
                return res.status(400).json({ message: "Invalid agent id" })
            }

            const agent = await User.findById(agentId)
            if (!agent || agent.role !== "AGENT") {
                return res.status(400).json({ message: "Agent not found" })
            }

            newAgentId = agent._id
        }

        ticket.assignedAgent = newAgentId
        await ticket.save()

        await sendTicket(ticket, res)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

// PUT /api/tickets/:id/close   (customer only, own ticket)
export const closeTicket = async (req, res) => {
    try {
        const ticket = await findTicket(req.params.id, res)
        if (!ticket) return

        if (ticket.customer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You can only close your own ticket" })
        }

        if (ticket.status === "CLOSED") {
            return res.status(400).json({ message: "Ticket is already closed" })
        }

        ticket.status = "CLOSED"
        await ticket.save()

        await sendTicket(ticket, res)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}