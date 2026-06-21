import { decrypt } from "../../utils/security/encryption.security.js";
import { successResponse } from "../../utils/response/success.response.js";
import { findByIdAndUpdate } from "../../DB/database.repository.js";
import UserModel from "../../DB/models/user.model.js";


export const getProfile = async (req,res) => {

    req.user.phone = await decrypt(req.user.phone)
    
    return successResponse({res,message:"Done",statusCode:200,data:req.user})

}


export const updateProfilePic = async (req,res) =>{
    
    const user = await findByIdAndUpdate({
        model:UserModel,
        id:req.user._id,
        update:{profilePic:req.file.finalPath}
    })

    return successResponse({
        res,statusCode:200,
        message:"Done",
        data: user
    })
}


export const updateCoverPic= async (req,res) => {

    const user = await findByIdAndUpdate({
        model:User , 
        id:req.user._id ,
         update:{coverImages : req.files?.map(file => file.finalPath)}})

    return successResponse(
        {res,message:"Done",
        statusCode:200,
        data:user})

}