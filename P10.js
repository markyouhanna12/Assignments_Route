// Write a function that destructures an object 
// to extract values and returns a formatted string.
// • Input Example: const person = {name: 'John', age: 25}
// • Output Example: 'John is 25 years old


function formatInfo({ name, age}){
    console.log(`${name} is ${age} years old`);
}

const person = {name: 'John', age: 25};
formatInfo(person);

