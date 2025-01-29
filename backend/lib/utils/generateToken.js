import jwt from "jsonwebtoken";

export const generateToken = (id, role, res) => {
    
    let token = jwt.sign({id, role}, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    res.cookie("jwt", {"token":token}, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
    });

    return token;
};