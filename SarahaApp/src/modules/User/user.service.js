import { decrypt } from "../../utils/security/encryption.security.js";
import { successResponse } from "../../utils/response/success.response.js";
import { findById, findByIdAndUpdate, findOneAndUpdate, updateOne } from "../../DB/database.repository.js";
import UserModel from "../../DB/models/user.model.js";
import { compareHash, genrateHash } from "../../utils/security/hash.security.js";
import { HashEnum } from "../../utils/enums/security.enum.js";
import { BadRequestException, ForbiddenException } from "../../utils/response/error.response.js";
import { RoleEnum } from "../../utils/enums/user.enum.js";


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


export const updatePassword = async (req,res) =>{
    const {oldPassword , newPassword , confirmPassword} = req.body

    const isValidOldPassword = await compareHash({
        plaintext : oldPassword,
        ciphertext : req.user.password,
        algorithm : HashEnum.Argon
    }) 

    if(!isValidOldPassword){
        throw BadRequestException({message : "Invalid Credentials"})
    }

    const hashedPassword = await genrateHash({
        plaintext : newPassword,
        algorithm : HashEnum.Argon
    })
    await updateOne({
        model : UserModel,
        filter : {_id : req.user._id},
        update : {password : hashedPassword}
    })

    successResponse({
        res,
        message : "Password updated successfully"
    })



}


export const freezeAccount = async (req , res) => {

    const {userId} = req.params
    console.log(userId);

    if(userId && req.user.role !== RoleEnum.Admin){
        throw ForbiddenException({message:"You are not authorized to freeze this account"})
    }

    const updatedUser = await findOneAndUpdate({
        model : UserModel,
        filter : {
            _id : userId || req.user._id , freezedAt : {$exists : false}
        },
        update : {
            freezedAt : Date.now(),
            freezedBy : req.user._id,
            $unset : {
                restoredBy : true , 
                restoredAt : true
            }
        }
    })

    return successResponse({
        res,
        statusCode : 200,
        message : "The account has been deactivated",
        data : {updatedUser}
    })
    

    
}