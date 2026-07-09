import { findById } from "../DB/database.repository.js";
import UserModel from "../DB/models/user.model.js";
import { get, revokeAllTokenKey, revokeTokenKey } from "../DB/redis.repository.js";
import { SignatureEnum, TokenTypeEnum } from "../utils/enums/user.enum.js";
import { BadRequestException, ForbiddenException, NotFoundException, unauthorizedException } from "../utils/response/error.response.js";
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

    const isRevoked = await get({
        key: revokeTokenKey({userId: decoded._id , jti : decoded.jti})
    })

    if(isRevoked){
       throw unauthorizedException({message:"Token is revoked"}) 
    }


    const user = await findById({
        model:UserModel,
        id: decoded._id
    })
    
    if(!user){
        throw NotFoundException({message:"Not Registered Account"})
    }

    if(user.changeCredentialsTime?.getTime() > decoded.iat * 1000){
        throw unauthorizedException({message : "Token is expired"})
    }
    const logoutAllTime = await get({
        key : revokeAllTokenKey({userId : decoded._id})
    })

    if(logoutAllTime && logoutAllTime > decoded.iat){
        throw unauthorizedException({message:"Token is expired"})
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