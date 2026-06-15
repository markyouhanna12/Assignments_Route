import jwt from "jsonwebtoken"
import { RoleEnum, SignatureEnum } from "../enums/user.enum.js"
import { ACCESS_ADMIN_SECRET_KEY, ACCESS_EXPIRES, ACCESS_USER_SECRET_KEY, REFRESH_ADMIN_SECRET_KEY, REFRESH_EXPIRES, REFRESH_USER_SECRET_KEY } from "../../../config/config.service.js"
import { v4 as uuidv4 } from "uuid";


export const genrateToken = ({payload ,secretKey , options = {}}) =>{
    return jwt.sign(payload , secretKey , options)
}

export const verifyToken = ({token , secretKey}) =>{

    return jwt.verify(token,secretKey)
}

export const getSignature = ({signatureLevel = SignatureEnum.User}) =>{
    
    let signature = {accessSignature : undefined , refreshSignature : undefined}

    switch(signatureLevel){
        case SignatureEnum.Admin:
            signature.accessSignature = ACCESS_ADMIN_SECRET_KEY
            signature.refreshSignature = REFRESH_ADMIN_SECRET_KEY
            break
        case SignatureEnum.User:
            signature.accessSignature = ACCESS_USER_SECRET_KEY
            signature.refreshSignature = REFRESH_USER_SECRET_KEY
            break
        default:
            signature.accessSignature = ACCESS_USER_SECRET_KEY
            signature.refreshSignature = REFRESH_USER_SECRET_KEY
            break

    }

    return signature
}

export const getNewLoginCredentials = async (user) =>{

    const signature = await getSignature({
        signatureLevel : user.role != RoleEnum.Admin ? SignatureEnum.User : SignatureEnum.Admin
    })

    const jwtid = uuidv4()

    const accessToken = genrateToken({
        payload:{_id : user._id},
        secretKey: signature.accessSignature,
        options:{expiresIn:ACCESS_EXPIRES , jwtid}

    })

    const refreshToken = genrateToken({
        payload:{_id : user._id},
        secretKey: signature.refreshSignature,
        options:{expiresIn:REFRESH_EXPIRES , jwtid}

    })

    return {accessToken , refreshToken}
}