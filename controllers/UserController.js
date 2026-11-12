import User from "../models/User.js";

export const getAgents = async (req, res) => {
    try {
        const agents = await User.find({ role: "AGENT" }).select("name email")
 
        res.status(200).json(agents)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}