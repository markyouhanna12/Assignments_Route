import { OAuth2Client } from "google-auth-library"
import { ACCESS_ADMIN_SECRET_KEY, Client_ID, REFRESH_ADMIN_SECRET_KEY } from "../../../config/config.service.js"
import { create, findById, findOne, findOneAndUpdate, updateOne } from "../../DB/database.repository.js"
import UserModel from "../../DB/models/user.model.js"
import { HashEnum } from "../../utils/enums/security.enum.js"
import { BadRequestException, ConflictException, NotFoundException } from "../../utils/response/error.response.js"
import { successResponse } from "../../utils/response/success.response.js"
import { encrypt } from "../../utils/security/encryption.security.js"
import { genrateHash , compareHash } from "../../utils/security/hash.security.js"
import { genrateToken, getNewLoginCredentials, verifyToken } from "../../utils/tokens/token.js"
import { ProviderEnum } from "../../utils/enums/user.enum.js"
import { generateOTP } from "../../utils/generateOTP.js"
import { emailEvent } from "../../utils/events/email.events.js"


export const signup = async (req,res) =>{
    const {firstName, lastName, email, password , phone} = req.body

    const user = await findOne({model:UserModel , filter:{email}})
    if(user){
        throw ConflictException({message:"User Already Exists"})
    }

    const hashedPassword = await genrateHash({plaintext:password , algorithm:HashEnum.Argon})
    
    const encryptedData = await encrypt(phone)

    const otp = generateOTP()

    const hashedOtp = await genrateHash({plaintext : otp , algorithm : HashEnum.Argon})

    const newUser = await create({model:UserModel ,
        data:[{
            firstName,
            lastName,
            email,
            password:hashedPassword,
            phone:encryptedData,
            cofirmEmailOTP : hashedOtp
        }] 
    })

    emailEvent.emit("confirmEmail", {to:email , otp , firstName})
    
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

    const confrimedAccount = await findOne({
        model: UserModel, 
        filter:{email , confirmEmail:{$exists : true}}
    })

    if(!confrimedAccount){
        throw BadRequestException({message:"Email not confirmed, please check your email"})
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

export const verifyGoogleAccount = async ({idToken}) =>{

    const client = new OAuth2Client()
    const ticket = await client.verifyIdToken({
        idToken,
        audience:Client_ID
    })

    const payload = ticket.getPayload()

    return payload
}


export const loginWithGoogle = async (req,res) =>{
    const {idToken} = req.body

    const {email 
        , picture
         , given_name
          , family_name 
          , email_verified} = await verifyGoogleAccount({idToken})
    
    if(!email_verified){
        throw BadRequestException({message:"Email not verified"})
    }

    let user = await findOne({
        model:UserModel,
        filter:{email}
    })

    if(!user){
        user = await create({
            model:UserModel,
            data:[{
                firstName: given_name,
                lastName : family_name,
                email,
                profilePic:picture,
                provider: ProviderEnum.Google
            }]
        })
    }else if (user.provider === ProviderEnum.System){
        throw BadRequestException({message:"This Email already exists"})
    }

    const credentials = await getNewLoginCredentials(user)

    return successResponse({
        res,statusCode: user.createdAt === user.updatedAt ? 201 : 200,
        message:"Login Successfully",
        data: credentials
    })
}


export const confirmEmail = async (req,res) =>{
    const {email , otp} = req.body
    const user = await findOne({
        model : UserModel,
        filter : {
            confirmEmail :{$exists : false},
            cofirmEmailOTP : {$exists : true}
        }
    })
    if(!user){
        throw NotFoundException({message : "User not found"})
    }
    const isOtpValid = await compareHash({
        plaintext : otp,
        ciphertext:user.cofirmEmailOTP,
        algorithm : HashEnum.Argon
    })

    if(!isOtpValid){
        throw BadRequestException({message : "Invalid otp"})
    }
    await updateOne({
        model : UserModel,
        filter : {email},
        update:{confirmEmail:Date.now(), $unset: {cofirmEmailOTP :true}}
    })

     return successResponse({
        res,
        statusCode:200,
        message:"Email confirmed successfully"
    })



}

export const forgetPassword = async (req , res) =>{
    const {email} = req.body
    console.log(email);
    

    const otp = generateOTP()

    const hashedOtp = await genrateHash({plaintext:otp , algorithm :HashEnum.Argon})

     const user = await findOneAndUpdate({
        model:UserModel,
        filter:{
            email,
            provider:ProviderEnum.System,
            confirmEmail: {$exists: true}

        },
        update:{forgetPasswordOTP:hashedOtp}
    })

    if(!user){
        throw NotFoundException ({message : "User not found or already confirmed"})
    }

    emailEvent.emit("forgetPassword", {to:email , otp , firstName:user.firstName})

    return successResponse({
        res, message:"OTP sent successfully"
    })

}

export const resetPassword = async (req,res) =>{

    const {email , otp , newPassword } = req.body

    const user = await findOne({
        model : UserModel, 
        filter:{
            email, 
            provider: ProviderEnum.System,
            confirmEmail : {$exists : true},
            forgetPasswordOTP : {$exists : true}
        }
    })

    if(!user){
        throw NotFoundException({message : "User Not Found"})
    }

    const isOtpValid = await compareHash({
        plaintext : otp,
        ciphertext : user.forgetPasswordOTP,
        algorithm : HashEnum.Argon
    })

     if(!isOtpValid){
        throw BadRequestException({message:"Invalid OTP"})
    }

    const hashedPassword = await genrateHash({
        plaintext : newPassword,
        algorithm : HashEnum.Argon
    })

    await updateOne({
        model : UserModel,
        filter:{email},
        update:{
            password : hashedPassword,
            $unset : {forgetPasswordOTP :true}
        }
    })

    return successResponse({
        res,
        statusCode:200,
        message:"Password Reset Successfully"
    })



}