// Write a function that accepts multiple parameters (two or more) and returns their sum.
// • Input Example: 1, 2, 3, 4, 5
// • Output Example: 15


function sum(...numbers){
    let sum = 0;
    for(let i=0 ; i<numbers.length; i++){
        sum += numbers[i];
    }
    console.log(sum);
}


sum(1, 2, 3, 4, 5);