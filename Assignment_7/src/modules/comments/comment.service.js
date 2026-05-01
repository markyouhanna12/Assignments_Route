import { Comment, Post, User } from "../../models/index.js"
import { Op } from "sequelize"


export const bulkCreateComment = async (comments) =>{
    try {
        await Comment.bulkCreate(comments)
        return {message: "comments created"}
    } catch (error) {
        return {error:error.message}

    }
}

export const updateComment = async (commentId,userId,content) => {
    const comment = await Comment.findByPk(commentId)

    if(!comment){
        return {error:"Comment not found"}
    }
    if(comment.userId !== userId){
        return {error:"You are not authorized to update this comment"}
    }
    comment.content = content
    await comment.save()
    return {message: "Commnet updated"}
}


export const findOrCreateComment = async (data) =>{
    const [comment,created] = await Comment.findOrCreate({
        where:{
            postId:data.postId,
            userId:data.userId,
            content:data.content
        },
        defaults:data
    })
    return {comment, created}
}


export const searchComments = async (word) =>{
    const {count ,rows} = await Comment.findAndCountAll({
        where:{
            content:{
                [Op.like] : `%${word}%`
            }
        }
    })

    if (count === 0){
        return null
    }
    return {count,comments:rows}

}

export const getLatestComments = async (postId) =>{
    const comments = await Comment.findAll({
        where:{postId},
        attributes:["id","content","createdAt"],
        order:[["createdAt","DESC"]],
        limit: 3
    })

    return comments
}

export const getCommentDetails = async (id) =>{
    const comment = await Comment.findByPk(id,{
        attributes:["id","content"],
        include:[
            {
                model: User,
                attributes:["id","name","email"]
            },
            {
                model:Post,
                attributes:["id","title","content"]
            }
        ]
    })
    return comment
}