const fs = require("fs")


const readableStream = fs.createReadStream("big.txt",{
    encoding:"utf8",
    highWaterMark: 64
})


readableStream.on("data",(chunk)=>{
    console.log("---- New Chunck ----");
    
    console.log(chunk);   
})

readableStream.on("end",()=>{
    console.log("finished reading file.");
    
})


