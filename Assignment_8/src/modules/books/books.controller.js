import  {db}  from "../../config/db.js";


export const insertBook = async (req,res) =>{
    try {
        const result = await db.collection("books").insertOne(req.body)
        res.status(201).json({message:"book added successfully",result:result})
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
}

export const insertManytBooks = async (req,res) =>{
    try {
        const result = await db.collection("books").insertMany(req.body)
        res.status(201).json({message:"books added successfully",result:result})
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateBookYear = async(req,res) =>{
    try {
        const {title} = req.params
        const {year} = req.query
        const result = await db.collection("books").updateOne(
            {title},{
                $set:{
                    year: Number(year)
                }
            })
            res.status(200).json(result);
    } catch (error) {
         res.status(500).json({ error: error.message });
    }
}

export const getBookByTitle = async (req,res) =>{
    try {
        const {title} = req.query
        const book = await db.collection("books").findOne({title})
        if(!book){
            return res.status(404).json({message:"Book not found"})
        }
        res.status(200).json(book)
        
    } catch (error) {
         res.status(500).json({ error: error.message });

    }
}

export const getBooksByYearRange = async (req,res) => {
    try {
        const {from , to} = req.query
        const books = await db.collection("books").find({
            year:{
                $gte: Number(from),
                $lte: Number(to)    
            }
            })
            .toArray();            
        if(books.length === 0){
            return res.status(404).json({message:"No Books in that Range"})
        }

        res.status(200).json(books);


    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}

export const getBooksByGenre = async(req,res) =>{
    try {
        const {genre} = req.query
        const books = await db.collection("books").find(
            {
                genres: genre
            }
        ).toArray()
        if(books.length === 0){
            return res.status(404).json({message:"No Books Found"})
        }

        res.status(200).json(books);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getBooksWithPagination = async (req,res) =>{
    try {
        const books = await db
        .collection("books")
        .find()
        .sort({year:-1})
        .skip(2)
        .limit(3)
        .toArray()

        if(books.length === 0){
            return res.status(404).json({message:"No Books Found"})
        }

        res.status(200).json(books);

        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getBooksWithIntegerYear = async (req,res) =>{
    try {
        const books = await db
        .collection("books")
        .find({
            year:{
                $type: "int"
            }
        })
        .toArray()
        if(books.length === 0){
            return res.status(404).json({message:"No Books Found"})
        }

        res.status(200).json(books);

        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

export const excludeGenres = async (req,res) =>{
    try {
        const books = await db
        .collection("books")
        .find({
            genres:{
                $nin:["Horror","Science Fiction"]
            }
        })
        .toArray()

        if(books.length === 0){
            return res.status(404).json({message:"No Books Found"})
        }

        res.status(200).json(books);

        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

export const deleteBooksBeforeYear = async(req,res) =>{
    try {
        const {year} = req.query
        const result = await db
        .collection("books")
        .deleteMany({
            year:{
                $lt: Number(year)
            }
        })

        res.status(200).json(result)

    } catch (error) {
        res.status(500).json({error:error.message})
    }
}


export const aggregateBooksAfter2000 = async (req,res) =>{
    try {
        const books = await db
        .collection("books")
        .aggregate([
            {
                $match:{
                    year:{
                        $gt:2000
                    }
                }
            },{
                $sort :{
                    year:-1
                }
            }
        ])
        .toArray()
 
        if(books.length === 0){
            return res.status(404).json({message:"No Books Found"})
        }

        res.status(200).json(books);

    
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}


export const aggregateBooksProjection = async (req,res) =>{
    try {
        const books = await db
        .collection("books")
        .aggregate([
            {
                $match:{
                    year:{
                        $gt:2000
                    }
                }
            },
            {
                $project:{
                    _id:0,
                    title:1,
                    author:1,
                    year:1
                }
            }
        ])
        .toArray()

        if(books.length === 0){
            return res.status(404).json({message:"No Books Found"})
        }

        res.status(200).json(books);

    } catch (error) {
        res.status(500).json({error:error.message})

    }
}


export const aggregateUnwindGenres = async (req,res) =>{
    try {
        const books = await db
        .collection("books")
        .aggregate([
            {
                $unwind : "$genres"
            },
            {
                $project:{
                    _id:0,
                    title:1,
                    genres:1
                }
            }
        ])
        .toArray()

         if(books.length === 0){
            return res.status(404).json({message:"No Books Found"})
        }

        res.status(200).json(books);

        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

export const aggregateBooksWithLogs = async (req,res) =>{
    try {
        const books = await db
    .collection("logs")
    .aggregate([
        {
            $lookup:{
                from:"books",
                localField: "book_id",
                foreignField:"_id",
                as:"book_details"
            }
        }
    ])
    .toArray()

    if(books.length === 0){
            return res.status(404).json({message:"No Books Found"})
        }

    res.status(200).json(books);

        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}