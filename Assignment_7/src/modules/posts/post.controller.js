import * as postService from "./post.service.js"

export const create = async (req,res) =>{
    const result = await postService.createPost(req.body)

    if(result.error){
        return res.status(400).json({message:result.error})
    }
    return res.status(201).json({message:result.message})
}


export const deletePost = async (req,res) =>{
    const {postId} = req.params
    const {userId} = req.body
    const result = await postService.deletePost(postId,userId)

    if(result.error === "Post not found"){
        return res.status(404).json({message:result.error})
    }
    if(result.error){
        return res.status(403).json({message:result.error})
    }
    return res.json({message:result.message})

}


export const getDetails = async (req,res) =>{
    const posts = await postService.getPostswithDetails()
    return res.json(posts)
}


export const getCommentCount = async (req,res) =>{
    const posts = await postService.getPostswithCommentCount()
    return res.json(posts)
}