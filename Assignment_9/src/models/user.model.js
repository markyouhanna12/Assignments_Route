import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true
        },
        password:{
            type:String,
            required:true
        },
        phone:{
            type:String,
            required:true
        },
        age:{
            type:Number,
            min:18,
            max:60
        }
    },
    {
        timestamps:true
    }
)

const User = mongoose.model("User",userSchema)

export default User