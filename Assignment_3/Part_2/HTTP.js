const http = require("http")
const fs = require("fs")
const path = require("path")

const filePath = path.join(__dirname,"users.json")

const server = http.createServer((req,res)=>{
    // Task 1
    if(req.method === "POST" && req.url === "/user"){
        let body = '';
        req.on("data",chunck =>{
            body += chunck.toString()
        })
        req.on("end",()=>{
            try {
                const newUser = JSON.parse(body)
                fs.readFile(filePath,"utf-8",(error,data)=>{
                    if(error){
                        res.writeHead(500)
                        return res.end(JSON.stringify({message:"Error reading file"}))
                    }
                    let users = []
                    if(data){
                        users = JSON.parse(data)
                    }

                    const exists = users.find(user => user.email === newUser.email)

                    if(exists){
                        res.writeHead(400,{"content-type":"application/json"})
                        return res.end(JSON.stringify({message:"Email already exists"}))
                    }
                    users.push(newUser)
                    fs.writeFile(filePath,JSON.stringify(users,null,2), error =>{
                        if(error){
                            res.writeHead(500)
                            return res.end(JSON.stringify({ message: 'Error writing file' }))
                        }
                        res.writeHead(201,{"content-type":"application/json"})
                        res.end(JSON.stringify({ message: 'User added successfully.' }));


                    })


                })
                
            } catch (error) {
                res.writeHead(400)
                res.end(JSON.stringify({ message: 'Invalid JSON input' }))   
            }

            
        })

    }
    // Task 2
    if(req.method === "PATCH" && req.url.startsWith("/user/")){
        const id = parseInt(req.url.split("/")[2])
        let body = ''
        req.on("data",chunk =>{
            body += chunk.toString()

        })
        req.on("end",()=>{
            try {
                const updates = JSON.parse(body)
                fs.readFile(filePath,"utf-8",(error,data)=>{
                    if(error){
                        res.writeHead(500)
                        return res.end(JSON.stringify({message : "Error reading file"}))
                    }
                    let users = JSON.parse(data)
                    const userIndex = users.findIndex(user => user.id === id)
                    if(userIndex === -1){
                        res.writeHead(404,{ 'Content-Type': 'application/json' })
                        return res.end(JSON.stringify({message :"User ID not found"}))
                    }
                    users[userIndex] = {
                        ...users[userIndex],
                        ...updates
                    }
                    fs.writeFile(filePath,JSON.stringify(users,null,2),error =>{
                        if(error){
                            res.writeHead(500)
                            return res.end(JSON.stringify({message:"error writing file"}))
                        }
                        res.writeHead(200,{ 'Content-Type': 'application/json' })
                        res.end(JSON.stringify({ message: 'User updated successfully.'}))
                    })

                })
                
            } catch (error) {
                res.writeHead(400)
                res.end(JSON.stringify({ message: 'Invalid JSON input'}))
                
            }
        })



    }
    // Task 3
    if(req.method === "DELETE" && req.url.startsWith("/user/")){
        const id = parseInt(req.url.split("/")[2])
        fs.readFile(filePath,"utf-8",(error,data)=>{
            if(error){
                res.writeHead(500)
                return res.end(JSON.stringify({message: 'Error reading file'}))
            }
            let users = JSON.parse(data)
            const userExists = users.find(user => user.id === id)

            if(!userExists){
                res.writeHead(404,{ 'Content-Type': 'application/json' })
                return res.end(JSON.stringify({ message: 'User ID not found.' }))
            }
             const updatedUsers = users.filter(user => user.id !== id)
             fs.writeFile(filePath,JSON.stringify(updatedUsers,null,2),error =>{
                if(error){
                    res.writeHead(500)
                    return res.end(JSON.stringify({message: 'Error writing file'}))
                }
                res.writeHead(200,{'Content-Type': 'application/json'})
                res.end(JSON.stringify({ message: 'User deleted successfully.'}))
             })

        })


    }
    // Task 4
    if(req.method === "GET" && req.url === "/user"){
        fs.readFile(filePath,"utf-8",(error,data)=>{
            if(error){
                res.writeHead(500,{'Content-Type': 'application/json'})
                return res.end(JSON.stringify({message: 'Error reading file'}))
            }
            try {
                let users = []
                if(data){
                    users = JSON.parse(data)

                }else{
                    users = []
                }
                res.writeHead(200,{'Content-Type': 'application/json'})
                res.end(JSON.stringify(users))

                
            } catch (error) {
                res.writeHead(500)
                res.end(JSON.stringify({message: 'Invalid JSON format'}))
                
            }
        })
    }
    // Task 5
    if(req.method === "GET" && req.url.startsWith("/user/")){
        const id =parseInt(req.url.split("/")[2])
        fs.readFile(filePath,"utf-8",(error,data)=>{
            if(error){
                res.writeHead(500,{'Content-Type': 'application/json'})
                return res.end(JSON.stringify({message: 'Error reading file'}))
            }
            try {
                let users = []
                if(data){
                    users = JSON.parse(data)

                }else{
                    users = []
                }
                const user = users.find(user => user.id === id)
                if(!user){
                    res.writeHead(404,{'Content-Type': 'application/json'})
                    return res.end(JSON.stringify({message: 'User not found.'}))
                }
                res.writeHead(200,{'Content-Type': 'application/json' })
                res.end(JSON.stringify(user))

                
            } catch (error) {
                res.writeHead(500)
                res.end(JSON.stringify({message: 'Invalid JSON format'}))
                
            }
        })
    }


}

)


server.listen(3000, () => {
  console.log('Server running on port 3000');
});

