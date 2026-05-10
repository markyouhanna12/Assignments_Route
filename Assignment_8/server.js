import dotenv from "dotenv"
dotenv.config()

import app from "./src/app.js"
import {connectDB} from "./src/config/db.js"
import { log } from "node:console"

const PORT = process.env.PORT || 80

const startServer = async() =>{
    try {
        await connectDB()
        app.listen(PORT,()=>{console.log(`Server running on port ${PORT}`);
           
        })

        
    } catch (error) {
        console.log(error);
        
    }
}



startServer()