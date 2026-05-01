import express from "express"
import userRoutes from "./modules/users/user.routes.js"
import postRoutes from "./modules/posts/post.routes.js"
import commentRoutes from "./modules/comments/comment.routes.js"
const app = express()

app.use(express.json())

// http://127.0.0.1:3000/api/v1/user/
app.use("/api/v1/user",userRoutes)
// http://127.0.0.1:3000/api/v1/post/
app.use("/api/v1/post",postRoutes)

// http://127.0.0.1:3000/api/v1/comment/
app.use("/api/v1/comment",commentRoutes)


app.all("/*dummy",(req,res)=>{
    res.status(404).json({message:"Router Handler not found"})
})

export default app;




