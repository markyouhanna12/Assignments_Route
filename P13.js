// Write a function to find the largest number in an array.
// • Input Example: [1, 3, 7, 2, 4]
// • Output Example: 7


function findLargest(arr){
    let largest = arr[0]
    for(let i=1 ; i<arr.length; i++){
        if(arr[i]> largest){
            largest = arr[i];
        }

    }
    console.log(largest)
}

let numbers = [1, 3, 7, 2, 4]
findLargest(numbers);

