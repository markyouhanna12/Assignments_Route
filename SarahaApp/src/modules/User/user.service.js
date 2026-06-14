import jwt from "jsonwebtoken"
import { ACCESS_TOKEN_SECRET } from "../../../config/config.service.js";
import { findById } from "../../DB/database.repository.js";
import { NotFoundException } from "../../utils/response/error.response.js";
import { decrypt } from "../../utils/security/encryption.security.js";
import UserModel from "../../DB/models/user.model.js";
import { successResponse } from "../../utils/response/success.response.js";

export const getProfile = async (req, res) => {
    const {authorization} = req.headers;
    // TODO: get user profile from database
    const payload = jwt.verify(authorization, ACCESS_TOKEN_SECRET)

    const user = await findById({
        model:UserModel,
        id:payload.userId
    })

    if(!user){
        throw NotFoundException("User not found")
    }
    user.phone = decrypt(user.phone)

return successResponse({
        res,
        statusCode:200,
        message:"User profile retrieved successfully",
        data:user
    })}