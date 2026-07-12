import { create, find, findById } from "../../DB/database.repository.js"
import messageModel from "../../DB/models/message.model.js"
import UserModel from "../../DB/models/user.model.js"
import { NotFoundException } from "../../utils/response/error.response.js"
import { successResponse } from "../../utils/response/success.response.js"


export const sendMessage = async (req , res) =>{
    const {receiverId} = req.params
    const {content} = req.body

    const user = await findById({
        model : UserModel,
        id : receiverId
    })
    if(!user){
        throw NotFoundException({message : "Receiver not found"})
    }

    const message = await create({
        model : messageModel,
        data : [{
            receiverId : user._id,
            content
        }]
    })

    if(!message){
        throw NotFoundException({message:"Message not sent"})
    }

    return successResponse({
        res,
        statusCode:201,
        message:"Message sent successfully", 
        data: {message}
    })


}

export const getMessagesAdmin = async (req , res) =>{

    const messages = await find({
        model : messageModel
    })

    return successResponse({
        res,
        statusCode:200,
        message:"Messages retrieved successfully", 
        data:{messages}
    })    
}

export const getMessages = async (req , res) => {
    
    const user = req.user
    const messages = await find({
        model : messageModel,
        filter :{receiverId : user._id},
        select : "content -_id "
    })
    return successResponse({
        res,
        statusCode:200,
        message:"Messages retrieved successfully", 
        data:{messages}
    })
}