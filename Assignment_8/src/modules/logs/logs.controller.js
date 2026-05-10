import { db } from "../../config/db.js";

export const insertLog = async (req,res) =>{
    try {
        const result = await db.collection("logs").insertOne(req.body)
         res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}