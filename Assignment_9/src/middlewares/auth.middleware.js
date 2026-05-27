import jwt from "jsonwebtoken"

const authMiddleware = (req,res,next) =>{
    try {
        const token = req.headers.token

        if(!token){
            return res.status(401).json({message:"Token required"})
        }
        const decoded = jwt.verify( token , process.env.JWT_SECRET)
        console.log("Decoded Token:", decoded)
        req.userId = decoded.id
        
        next()
        
    } catch (error) {
        return res.status(401).json({message:"Invalid token"})
        
    }
}

export default authMiddleware