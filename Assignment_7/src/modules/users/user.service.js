import {User} from "../../models/user.model.js"


export const createUser = async (data) =>{
    const existingUser = await User.findOne({
        where:{email:data.email}
    })
    if(existingUser){
        return {error:"Email already exists"}
    }
    try {
        const user = User.build(data)
        await user.save()
        return {user}
        
    } catch (error) {
        return{error:error.message}
        
    }
}

export const upsertUser = async (id,data) =>{
    try {
        await User.upsert(
            {id,...data},{validate:false}
        )

        return {message: "user created or updated successfully"}
        
    } catch (error) {
        return {error:error.message}
        
    }
}

export const getUserByEmail = async(email) =>{
    const user = await User.findOne({
        where:{email}
    })
    if(!user)
        return null;
    return user
}

export const getUserById = async(id) =>{
    const user = await User.findByPk(id,
        {attributes:{exclude:["role"]}}
    )
    return user
}