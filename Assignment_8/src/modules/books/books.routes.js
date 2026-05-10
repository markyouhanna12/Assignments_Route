import express from "express"
import { 
insertBook,
insertManytBooks,
updateBookYear,
getBookByTitle,
getBooksByYearRange,
getBooksByGenre,
getBooksWithPagination,
getBooksWithIntegerYear,
excludeGenres,
deleteBooksBeforeYear,
aggregateBooksAfter2000,
aggregateBooksProjection,
aggregateUnwindGenres,
aggregateBooksWithLogs} from "./books.controller.js"

const router = express.Router()

//http://localhost:3000/books/
router.post("/",insertBook)

//http://localhost:3000/books/batch
router.post("/batch",insertManytBooks)

//http://localhost:3000/books/:titleBook?year=yearDate
router.patch("/:title", updateBookYear);

//http://localhost:3000/books/title?title=???
router.get("/title",getBookByTitle)

//http://localhost:3000/books/year?from=1990&to=2010
router.get("/year",getBooksByYearRange)

//http://localhost:3000/books/genre?genre=Science Fiction
router.get("/genre",getBooksByGenre)

//http://localhost:3000/books/skip-limit 
router.get("/skip-limit",getBooksWithPagination)

//http://localhost:3000/books/year-integer
router.get("/year-integer", getBooksWithIntegerYear);

//http://localhost:3000/books/exclude-genres
router.get("/exclude-genres", excludeGenres);

//http://localhost:3000/books/before-year
router.delete("/before-year", deleteBooksBeforeYear);



//http://localhost:3000/books/aggregate1
router.get("/aggregate1", aggregateBooksAfter2000);
//http://localhost:3000/books/aggregate2
router.get("/aggregate2", aggregateBooksProjection);
//http://localhost:3000/books/aggregate3
router.get("/aggregate3", aggregateUnwindGenres);
// //http://localhost:3000/books/aggregate4
router.get("/aggregate4", aggregateBooksWithLogs);



export default router
