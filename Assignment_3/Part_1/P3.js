const fs = require("fs")

const zlib = require('zlib');

const {pipeline} = require("stream")


pipeline(
    fs.createReadStream("big.txt"),
    zlib.createGzip(),
    fs.createWriteStream('data.txt.gz'),
    (err) => {
        if(err){
            console.error('Pipeline failed:', err.message)
        }
        else
            {
            console.log('File compressed successfully.')
            }
    }

)