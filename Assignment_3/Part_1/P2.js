const fs = require("fs")


const readableStream = fs.createReadStream("big.txt",{
    encoding:"utf8",
    highWaterMark: 64
})


const writableStream = fs.createWriteStream("dest.txt")



readableStream.pipe(writableStream)

readableStream.on("end",()=>{
    console.log("file copied using streams.");
    
})

writableStream.on('error', (err) => {
  console.error('Write Error:', err.message);
});