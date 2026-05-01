import { Post, User, Comment } from "../../models/index.js";
import {fn,col} from "sequelize"



export const createPost = async (data) =>{
    try {
        const post = Post.build(data)
        await post.save()
        return {message:"Post created successfully"}
        
    } catch (error) {
        return {error:error.message}
    }
}

export const deletePost = async(postId,userId) =>{
    const post = await Post.findByPk(postId)
    if(!post){
        return {error:"Post not found"}
    }
    if(post.userId !== userId){
        return {error:"You are not authorized to delete this post"}
    }
    await post.destroy()

    return {message : "post deleted"}
}

export const getPostswithDetails = async () =>{
    const posts = Post.findAll({
        attributes:["id","title"],
        include:[
            {
                model: User,
                attributes:["id","name"]
            },
            {
                model: Comment,
                attributes:["id","content"]
            }
        ]
    })

    return posts
}

export const getPostswithCommentCount = async () =>{
    const posts = await Post.findAll({
        attributes:[
            "id",
            "title",
            [fn("COUNT",col("Comments.id")),"commentCount"]
        ],
        include:[
            {
                model:Comment,
                attributes:[]
            }
        ],
        group:["Post.id"]
    })
    return posts
}