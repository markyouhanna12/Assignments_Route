import { create, findOne } from "../../DB/database.repository.js"
import UserModel from "../../DB/models/user.model.js"
import { HashEnum } from "../../utils/enums/security.enum.js"
import { BadRequestException, ConflictException, NotFoundException } from "../../utils/response/error.response.js"
import { successResponse } from "../../utils/response/success.response.js"
import { genrateHash , compareHash } from "../../utils/security/hash.security.js"


export const signup = async (req,res) =>{
    const {firstName, lastName, email, password , phone} = req.body

    const user = await findOne({model:UserModel , filter:{email}})
    if(user){
        throw ConflictException({message:"User Already Exists"})
    }

    const hashedPassword = await genrateHash({plaintext:password , algorithm:HashEnum.Argon})

    const newUser = await create({model:UserModel ,
        data:[{
            firstName,lastName,email,password:hashedPassword , phone:phone
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

    return successResponse({res,statusCode:200,message:"Login successfully"})
}