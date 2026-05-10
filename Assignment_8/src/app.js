import express from "express"

import collectionsRoutes from "./modules/collections/collections.routes.js"
import booksRoutes from "./modules/books/books.routes.js"
import logsRoutes from "./modules/logs/logs.routes.js"


const app = express()

app.use(express.json())


//http://localhost:3000/collection/
app.use("/collection",collectionsRoutes)

//http://localhost:3000/books/
app.use("/books",booksRoutes)

//http://localhost:3000/logs/
app.use("/logs",logsRoutes)




app.all("/*dummy",(req,res)=>{
    res.status(404).json({
        success:false,
        message:"Route not found"
    })
})



export default app;
