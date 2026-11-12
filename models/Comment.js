import mongoose from "mongoose"

const commentSchema = new mongoose.Schema(
    {
        ticket:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Ticket"
        },
        user:{
            type: mongoose.Schema.Types.ObjectId,
            required:true,
            ref: "User",
        },
        message:{
            type: String,
            required:true,
            trim:true,
        },
    },
    {timeseries: true}
)


const Comment= mongoose.model("Comment", commentSchema)

export default Comment