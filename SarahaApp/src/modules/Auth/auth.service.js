import { ACCESS_ADMIN_SECRET_KEY, REFRESH_ADMIN_SECRET_KEY } from "../../../config/config.service.js"
import { create, findById, findOne } from "../../DB/database.repository.js"
import UserModel from "../../DB/models/user.model.js"
import { HashEnum } from "../../utils/enums/security.enum.js"
import { BadRequestException, ConflictException, NotFoundException } from "../../utils/response/error.response.js"
import { successResponse } from "../../utils/response/success.response.js"
import { encrypt } from "../../utils/security/encryption.security.js"
import { genrateHash , compareHash } from "../../utils/security/hash.security.js"
import { genrateToken, getNewLoginCredentials, verifyToken } from "../../utils/tokens/token.js"


export const signup = async (req,res) =>{
    const {firstName, lastName, email, password , phone} = req.body

    const user = await findOne({model:UserModel , filter:{email}})
    if(user){
        throw ConflictException({message:"User Already Exists"})
    }

    const hashedPassword = await genrateHash({plaintext:password , algorithm:HashEnum.Argon})
    
    const encryptedData = await encrypt(phone)

    const newUser = await create({model:UserModel ,
        data:[{
            firstName,lastName,email,password:hashedPassword , phone:encryptedData
        }] 
    })
    return successResponse({res,statusCode:201,message:"User Created successfully",data:{newUser}})
}

export const login = async (req,res) =>{
    const {email , password} = req.body
    const user = await findOne({model:UserModel , filter:{email}})

    if(!user){
        throw NotFoundException({message:"Invalid email or password"})
    }
    const isPasswordValid = await compareHash({
        plaintext:password,
        ciphertext:user.password,
        algorithm:HashEnum.Argon
    })
    if(!isPasswordValid){
        throw BadRequestException({message:"Invalid email or password"})
    }

    const tokens = await getNewLoginCredentials(user)
   
    return successResponse({
        res,
        statusCode:200,
        message:"Login successfully",
        data:{tokens}
    })
}

export const refreshToken = async (req,res) =>{
    const {authorization} = req.headers

    const decodedToken = await verifyToken({
        token:authorization,
        secretKey:REFRESH_ADMIN_SECRET_KEY
    })
    
    const user = await findById({
        model:UserModel,
        id:decodedToken._id
    })

    if(!user){
        throw NotFoundException({message:"User Not Found"})
    }
    const accessToken = await genrateToken({
        payload:{id:user._id},
        secretKey:ACCESS_ADMIN_SECRET_KEY
    })

    return successResponse({
        res,
        statusCode:200,
        message:"Token successfully refreshed",
        data:{accessToken}
    })
} 