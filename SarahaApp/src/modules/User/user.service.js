import { decrypt } from "../../utils/security/encryption.security.js";
import { successResponse } from "../../utils/response/success.response.js";


export const getProfile = async (req,res) => {

    req.user.phone = await decrypt(req.user.phone)
    
    return successResponse({res,message:"Done",statusCode:200,data:req.user})

}