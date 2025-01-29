import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import dotenv from "dotenv";

dotenv.config();

export const protectRoute = async (req, res, next) => {

    try {
        
        const token = req.cookies.jwt.token;
    
        if(!token){
            return res.status(401).json({error: "Unauthorized, No token provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({error: "Unauthorized, Invalid token"});
        }

        
        const user = await User.findOne({
            where: { id: decoded.id }, // Use ID instead of email
            attributes: { exclude: ["password"] }, // Exclude password field
        });
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        req.user = user;

        next();
    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        return res.status(500).json({error: "Internal server error"});
    }
};