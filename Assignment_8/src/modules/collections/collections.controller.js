import { bsonType } from "bson";
import  {db}  from "../../config/db.js";
import { title } from "node:process";


export const createBooksCollection = async (req,res) => {
  try {
    const result = await db.createCollection("books", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["title"],
          properties: {
            title: {
              bsonType: "string",
              minLength: 1,
              description: "Title must be a non-empty string"
            }
          }
        }
      }
    })
    res.status(201).json({message: "Books collection created successfully"})
  } catch (error) {
    res.status(500).json({error:error.message})
  }

}


export const createAuthorsCollection = async (req,res) =>{
  try {
    const result = await db.collection("authors").insertOne({
      name:"Author1",
      nationality: "British"
    })
    res.status(201).json({message: "Authors collection created successfully"})
    
  } catch (error) {
    res.status(500).json({error:error.message})
  }
}


export const createCappedLogsCollection = async (req,res)=>{
  try {
    const result = db.createCollection("logs",{
      capped:true,
      size:1024 * 1024
    })

    res.status(201).json({message: "Logs collection created successfully",Result:result})
  } catch (error) {
    res.status(500).json({error:error.message})
  }
}


export const createBooksIndex = async (req,res) =>{
  try {
    const result = await db.collection("books").createIndex({title:1})
  res.status(201).json({message: "Indexes created successfully",Result:result})

  } catch (error) {
        res.status(500).json({error:error.message})
  }
}