
function longestCommanPrefix(strs){
    if(strs.length === 0 ){
        return ""
    }

    let prefix = strs[0]
    for(let i = 1 ; i<strs.length; i++){
        while(strs[i].indexOf(prefix) !== 0){
            prefix = prefix.slice(0,-1)
            if(prefix === ''){
                return ''
            }
        }
    }
    return prefix
}

let out =  longestCommanPrefix(["flower", "flow", "flight"])
console.log(out);


// strs= ["flower", "flow", "flight"]
// let prefix = strs[0] // flower
// console.log(strs[1].indexOf('flower'));
//  prefix --> "flowe"
//  prefix --> "flow"
// console.log(strs[2].indexOf('flow'));
//  prefix --> "flo"
//  prefix --> "fl"


