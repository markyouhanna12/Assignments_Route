// Write a function that returns 
// a promise which resolves after 3 seconds with a 'Success' message.
// • Output Example: “Success”

function delay(){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve("Success")
        },3000)
    })
}

delay().then((message)=>{
    console.log(message)
})
