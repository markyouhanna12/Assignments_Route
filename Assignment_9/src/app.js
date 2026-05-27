import express from "express"
import userRoutes from "./modules/users/user.routes.js"
import noteRoutes from "./modules/notes/note.routes.js"

const app = express()

app.use(express.json())

app.use("/users",userRoutes)
app.use("/notes", noteRoutes);



app.all("/*dummy",(req,res)=>{
    res.status(404).json({
        success:false,
        message:"Route not found"
    })
})


export default app;




