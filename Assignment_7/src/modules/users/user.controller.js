import * as userService from "./user.service.js"

export const signup = async (req,res) =>{
    const result = await userService.createUser(req.body)
     if (result.error) {
        return res.status(400).json({ message: result.error });
        }

    return res.json({message:"User added successfully", user:result.user})
}

export const updateUser = async (req,res) =>{
    const {id} = req.params
    const result = await userService.upsertUser(id,req.body)
    if(result.error){
        return res.status(400).json({message:result.error})
    }
    return res.status(201).json({message: result.message})
}

export const getByEmail = async (req,res) =>{
    const {email} = req.query
    const user = await userService.getUserByEmail(email)

    if(!user){
        return res.status(404).json({message:"no user found"})
    }
    return res.json({user})
}

export const getById = async (req,res) =>{
    const {id} = req.params
    const user = await userService.getUserById(id)
    if(!user){
        res.status(404).json({message:"no user found"})
    }
    return res.json(user)
}

