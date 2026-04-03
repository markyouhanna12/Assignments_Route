const express = require("express")
const fs = require("fs")
const app = express()


app.use(express.json())


const file_Path = "./users.json"

const readUsers = () =>{
    const data = fs.readFileSync(file_Path,"utf-8")
    return JSON.parse(data)
}


const writeUsers = (users) =>{
    fs.writeFileSync(file_Path,JSON.stringify(users,null,2))
}
// Task 1
app.post("/user",(req,res)=>{
    const {name , age , email} = req.body
    if(!name || !age || !email){
        return res.status(400).json({message: "All fields are required" })
    }

    const users = readUsers()
    const existingUser = users.find((user)=> user.email === email)
    if(existingUser){
        return res.status(400).json({message: "Email already exists."})
    }
    const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1

    const newUser = {
        id: newId,
        name,
        age,
        email
    }
    users.push(newUser)
    writeUsers(users)
    res.status(201).json({message: "User added successfully.",user: newUser})
})

// Task 2
app.patch("/user/:id",(req,res)=>{
    const userId = parseInt(req.params.id)
    const updates = req.body
    
    const users = readUsers()

    const userIndex = users.findIndex(user => user.id === userId)

    if(userId === -1){
        return res.status(404).json({message: "User ID not found."})
    }

    users[userIndex] = {
        ...users[userIndex],
        ...updates
    }

    writeUsers(users)

    if(updates.name){
        return res.json({message: "User name updated successfully."})
    }
    if(updates.age){
        return res.json({message: "User age updated successfully."})
    }
    if(updates.email){
        return res.json({message: "User email updated successfully."})
    }
    res.json({message: "User updated successfully." })


})
// Task 3
app.delete("/user/:id",(req,res)=>{
    const userId = parseInt(req.params.id)
    const users = readUsers()

    const userIndex = users.findIndex(user => user.id === userId)

    if(userIndex === -1){
        return res.status(404).json({message: "User ID not found."})
    }
    users.splice(userIndex,1)
    writeUsers(users)
    res.json({message: "User deleted successfully."})

})
// Task 4
app.get("/user/getByName",(req,res)=>{
    const {name} = req.query
    const users = readUsers()

    if(!name){
        return res.status(400).json({ message: "Name query is required." })
    }

    const user = users.find(
        (user)=>user.name.toLowerCase() === name.toLocaleLowerCase())
    
    if(!user){
        return res.status(404).json({message: "User name not found."})
    }
    res.json(user)


})
// Task 5
app.get("/user",(req,res)=>{
    const users = readUsers()
    res.status(200).json(users)
})
// Task 6
app.get("/user/filter",(req,res)=>{
    const {minAge} = req.query
    
    if(!minAge){
        return res.status(400).json({message: "minAge query is required."})
    }
    const users = readUsers()
    const minAgeNumber = parseInt(minAge)

    const filteredUsers = users.filter(user => user.age >= minAgeNumber)

    if(filteredUsers.length === 0){
            return res.status(404).json({ message: "no user found" });
    }
    res.json(filteredUsers)
})
// Task 7
app.get("/user/:id",(req,res)=>{
    const userId = parseInt(req.params.id)
    const users = readUsers()
    const user = users.find(user => user.id === userId)
    if(!user){
        return res.status(404).json({message: "User ID not found."})
    }
    res.json(user)
})

app.listen(4000,()=>{
    console.log("Server running on port 4000");
    
})