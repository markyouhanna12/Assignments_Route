// Create an array of numbers and 
// return only the even numbers using filter method.
// • Input Example: [1, 2, 3, 4, 5]
// • Output Example: [2,4]

let numbers = [1,2,3,4,5];

let even_numbers = numbers.filter((num) => num % 2 === 0);
console.log(even_numbers);