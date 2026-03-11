// Write a function that takes an object and 
// returns an array containing only its keys.
// • Input Example: name: "John", age: 30}
// • Output Example: ["name", "age"]


function getKey(obj){
    return Object.keys(obj);
}


let ob1 = {name: "John", age: 30};
console.log(getKey(ob1));