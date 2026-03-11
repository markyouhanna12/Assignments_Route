// Use for loop to print all numbers between 1 and 10, 
// skipping even numbers using continue
// • Output Example:1, 3, 5, 7, 9


for (let i = 1 ; i<=10; i++){
    if (i % 2 === 0){
        continue;
    }
    else {
        console.log(i);
    }
}