import * as commentService from "./comment.service.js"

export const blukCreate = async (req,res) =>{
    const {comments} = req.body
    const result = await commentService.bulkCreateComment(comments)
    if(result.error){
        return res.status(400).json({message:result.error})
    }
    return res.status(201).json({message:result.message})
}


export const update = async (req,res) =>{
    const {commentId} =req.params
    const {userId, content} =req.body
    const result = await commentService.updateComment(commentId,userId,content)
    if(result.error === "Comment not found"){
        res.status(404).json({message:result.error})
    }
    if(result.error){
        return res.status(403).json({message:result.error})
    }
    return res.json({message:result.message})
}

export const findOrCreate = async (req,res) =>{
    const result = await commentService.findOrCreateComment(req.body)

    return res.json(result)
}

export const search = async (req,res) =>{
    const {word} =req.query
    const result = await commentService.searchComments(word)
    if(!result){
        return res.status(404).json({message:"no comments found "})
    }
    return res.json(result)
}


export const newest = async (req,res) =>{
    const {postId} = req.params
    const comments = await commentService.getLatestComments(postId)
    return res.json(comments)
}


export const getDetails = async (req,res) =>{
    const {id} = req.params
    const comment = await commentService.getCommentDetails(id)
    
    if(!comment){
        return res.status(404).json({message:"no comment found"})
    }
    return res.json(comment)
}