import express from 'express';
import {
    createBooksCollection,
    createAuthorsCollection,
    createCappedLogsCollection,
    createBooksIndex} from './collections.controller.js';

const router = express.Router()


//http://localhost:3000/collection/books
router.post('/books', createBooksCollection);

//http://localhost:3000/collection/authors
router.post("/authors",createAuthorsCollection)

//http://localhost:3000/collection/logs/capped
router.post("/logs/capped",createCappedLogsCollection)

//http://localhost:3000/collection/books/index
router.post("/books/index", createBooksIndex);



export default router