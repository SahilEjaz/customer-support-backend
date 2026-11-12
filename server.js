import express from "express"
import cors from "cors"
import connectDB from "./config/db.js"
import "dotenv/config"
import AuthRoute from "./routes/AuthRoute.js"
import TicketRoute from "./routes/TicketRoute.js"
import CommentRoute from "./routes/CommentRoute.js"
import UserRoute from "./routes/UserRoute.js"

connectDB()

const app= express()

app.use(cors())
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("support Ticketing system is running")
})

app.use("/api/auth", AuthRoute)
app.use("/api/tickets", TicketRoute)
app.use("/api/comment", CommentRoute)
app.use("/api/user", UserRoute)



app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
})

const port =process.env.PORT || 5000

app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})