import Note from "../../models/note.model.js"
import bcrypt from "bcrypt"
import CryptoJS from "crypto-js"
import generateToken from "../../utils/generateToken.js"
import mongoose from "mongoose"

export const createNote = async (req,res) =>{
    try {
        const {title,content} = req.body
        await Note.create({
            title,
            content,
            userId:req.userId
        })

        res.status(201).json({message:"Note created"})
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const updateSingleNote = async (req,res) =>{
    try {
        const {noteId} = req.params
        const note = await Note.findById(noteId)

        if(!note){
            return res.status(404).json({message:"Note not found"})
        }

        if(note.userId.toString() !== req.userId){
            return res.status(403).json({message:"You are not the owner"})
        }

        note.title = req.body.title || note.title
        note.content = req.body.content || note.content

        await note.save()

        res.json({message:"updated",note})




    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const replaceNote = async (req,res) =>{
    try {
        const {noteId} = req.params
        const note = await Note.findById(noteId)

        if(!note){
            return res.status(404).json({message:"Note not found"})
        }
        if(note.userId.toString() !== req.userId){
            return res.status(403).json({message:"You are not the owner"})
        }

        const replacedNote = await Note.findByIdAndUpdate(noteId,{
            title:req.body.title,
            content:req.body.content,
            userId:req.userId
        })

        res.json({message:"Note replaced",replacedNote})
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const updateAllTitles = async (req, res) => {
  try {

    const { title } = req.body;

    const result = await Note.updateMany(
      {
        userId: req.userId
      },
      {
        title
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "No note found",
      });
    }

    res.json({
      message: "All notes updated",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
}

export const deleteSingleNote = async (req,res) =>{
    try {
        const {noteId} = req.params

        const note = await Note.findById(noteId)

        if(!note){
            return res.status(404).json({message:"Note not found"})

        }
        if(note.userId.toString() !== req.userId){
            return res.status(403).json({message:"You are not the owner"})
        }

        await note.deleteOne()

        res.json({message:"deleted",note})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const paginateNotes = async (req,res) =>{
    try {

        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 3
        const skip = (page - 1) * limit

        const notes = await Note.find({userId:req.userId})
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit)

        res.json(notes)
        
        
    } catch (error) {        
        res.status(500).json({message:error.message})
    }
}

export const getSingleNote = async (req,res) =>{
    try {
        const note = await Note.findById(req.params.id)

        if(!note){
            return res.status(404).json({message:"Note not found"})
        }

        if(note.userId.toString() !== req.userId){
            return res.status(403).json({message:"You are not the owner"})
        }

        res.json(note)
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const getNoteByContent = async (req,res) =>{
    try {
        const {content} = req.query

        const note = await Note.findOne({
            content,
            userId: req.userId
        })

        if(!note){
            return res.status(404).json({message:"No note found"})
        }

        res.json(note)

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const getNotesWithUser = async (req,res) =>{
    try {
        const notes = await Note.find({
            userId: req.userId
        })
        .select("title userId createdAt")
        .populate({path:"userId",select:"email"})

        res.json(notes)

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const aggregateNotes = async (req,res) =>{
    try {
        const {title} = req.query
        const notes = await Note.aggregate([
            {
                $match:{
                    userId: new mongoose.Types.ObjectId(req.userId)
                }
            },
            {
                $match:{
                    title:title
                }
            },
            {
                $lookup:{
                    from:"users",
                    localField:"userId",
                    foreignField:"_id",
                    as:"user"
                }
            },
            {
                $unwind:"$user"
            },
            {
                $project:{
                    title: 1,
                    createdAt: 1,
                    "user.name": 1,
                    "user.email": 1
                }
            }
        ])

        res.json(notes)

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const deleteAllNotes = async (req,res) =>{
    try {
        await Note.deleteMany({userId:req.userId})

        res.json({message:"Deleted"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}