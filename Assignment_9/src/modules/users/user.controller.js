import User from "../../models/user.model.js"
import bcrypt from "bcrypt"
import CryptoJS from "crypto-js"
import generateToken from "../../utils/generateToken.js"


export const signup = async (req,res) =>{

    try {
        const {name,email,password,phone,age} = req.body
        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.status(400).json({message:"Email already exists"})
        }

        const hashedPassword = await bcrypt.hash(password,10)
        const encryptedPhone = CryptoJS.AES.encrypt(phone,process.env.PHONE_SECRET).toString()

        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            phone:encryptedPhone,
            age
        })

        res.status(201).json({message:"User added successfully",user})
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }


}

export const login = async (req,res) =>{
    try {
        const {email,password} = req.body
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({message:"Invalid email or password"})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
            console.log("error");
            return res.status(400).json({message:"Invalid email or password"})
        }
        const token = generateToken(user._id)

        res.json({message: "Login successful",token})

        
    } catch (error) {
        res.status(500).json({message:error.message})

    }
}


export const updateUser = async (req,res) =>{
    try {
        const userId = req.userId
        const {email} = req.body
        console.log(userId);
        

        if(email){
            const existingEmail = await User.findOne({email})             
            if(existingEmail){
            return res.status(400).json({message:"Email already exists"})
            }
        
        }

        const updatedUser = await User.findByIdAndUpdate(userId,req.body,{new:true})

        if(updatedUser === null){
            return res.status(404).json({message:"User not found"})
        }
        
        res.json({message:"User updated",updatedUser})
        
    } catch (error) {
        res.status(500).json({message:error.message})       
    }






}

export const deleteUser = async (req,res) =>{
    try {
        const userId = req.userId
        const deletedUser = await User.findByIdAndDelete(userId)

        if(!deletedUser){
            return res.status(404).json({message:"User not found"})

        }

        res.json({message:"User deleted"})



    } catch (error) {
        res.status(500).json({message:error.message})      
    }
}


export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId,{createdAt:0,updatedAt:0,__v:0});

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
