// Create an array of strings and 
// return their lengths using map method 
// • Input: ["a", "ab", "abc"]
// • Output Example: [1, 2, 3]

function getStringLengths(arr){
    return arr.map(str => str.length);
}

let input = ["a", "abcd", "abc"];
let output = getStringLengths(input);
console.log(output)