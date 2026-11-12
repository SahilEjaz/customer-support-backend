import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"


const genrateToken =(user)=> {
    return jwt.sign(
        {id: user._id, role: user.role },
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    )
}

export const registerUser = async (req, res)=>{
    try {
        const {name, email, password }=req.body

        if(!name || !email || !password){
            return res.status(400).json({message: "Name, email and password are required"})
        }

        if(password.length < 6){
            return res.status(400).json({message:"Password must me 6 characters"})
        }
        const existingUser = await User.findOne({email: email.toLowerCase()})
        if(existingUser){
            return res.status(409).json({message: "Email Already Registered"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password : hashedPassword,
        })

        return res.status(201).json({
            token: genrateToken(user),
            User:{
                id: user._id,
                 name: user.name,
                email: user.email,
                role: user.role,

            }
        })


    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message})
        
    }
}
export const loginUser = async (req, res) =>{
        try {
            const{email, password}= req.body

            if(!email || !password){
               return res.status(400).json({message:"Email and password are required"})
            }
            const user =await User.findOne({email :email.toLowerCase()})

            if (!user){
               return res.status(401).json({message: "Invalid email or password"})

            }
            
            const isMatch= await bcrypt.compare(password, user.password)
            if(!isMatch){
                return res.status(401).json({message:"Invalid email or password"})
            }

             return res.status(200).json({
                token: genrateToken(user),
                User:{
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            })
        } catch (error) {
          return  res.status(500).json({message:"server error",error: error.message})
        }
    }