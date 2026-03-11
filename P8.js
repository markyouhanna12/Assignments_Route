// Write a function that checks if a number is divisible by 3 and 5.
// • Input Example: 15
// • Output Example: “Divisible by both”


function checkDivision(num){
    if(num % 3 === 0 && num % 5 === 0){
        console.log("Divisible by both");
    }
}

checkDivision(15);