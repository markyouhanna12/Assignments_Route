import { findById } from "../DB/database.repository.js";
import UserModel from "../DB/models/user.model.js";
import { SignatureEnum, TokenTypeEnum } from "../utils/enums/user.enum.js";
import { BadRequestException, ForbiddenException, NotFoundException } from "../utils/response/error.response.js";
import { getSignature, verifyToken } from "../utils/tokens/token.js";


export const decodedToken = async ({authorization , tokenType = TokenTypeEnum.Access}) =>{

    const [Bearer , token] = authorization.split(" ") || []
    
    if(!Bearer || !token){
        throw BadRequestException({message:"Invalid Token"})
    }

    const signature = await getSignature({signatureLevel:SignatureEnum[Bearer]})
    
    
    const decoded = verifyToken({token:token,
        secretKey:tokenType === TokenTypeEnum.Access 
        ? signature.accessSignature
        : signature.refreshSignature})

        

    const user = await findById({
        model:UserModel,
        id: decoded._id
    })
    
    if(!user){
        throw NotFoundException({message:"Not Registered Account"})
    }

    return {user , decoded}
}

export const authentication = ({tokenType = TokenTypeEnum.Access}) =>{
    return async (req , res , next) =>{
        const { user, decoded } = await decodedToken ({
            authorization:req.headers.authorization,
            tokenType,
        }) || {}

        req.user = user
        req.decoded = decoded

        return next()
    }
}


export const authorization = ({accessRoles = []}) =>{
    return async (req , res , next) =>{
        if(!accessRoles.includes(req.user.role)){
            throw ForbiddenException({message:"Unauthorized access"})
        }
        return next()
    }
}