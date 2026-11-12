import mongoose from "mongoose"

const ticketSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
            trim: true,
        },
        description:{
            type:String,
            required: true,
        },
        category:{
            type: String,
            enum:["Technical Issue", "Billing","Account", "Feature Request", "General"],
            default:"General",
        },
        priority:{
            type: String,
            enum:["LOW", "MEDIUM", "HIGH", "URGENT"],
            default :"MEDIUM",
        },
        status:{
            type:String,
            enum:["OPEN", "IN_PROGRESS", "WAITING_FOR_CUSTOMER", "RESOLVED", "CLOSED"],
            default:"OPEN",
        },
        customer:{
            type: mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"User",
        },
        assignedAgent:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            default: null,
        },
    },
    {timestamps: true}
)

const Ticket = mongoose.model("Ticket", ticketSchema)

export default Ticket