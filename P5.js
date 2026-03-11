// Use the spread operator to merge two arrays, 
// then return the merged array.
// • Input Example: [1, 2, 3], [4, 5, 6]
// • Output Example: [1, 2, 3, 4, 5, 6]

function merge_arrays(arr1,arr2){
    return [...arr1,...arr2];
}

 let merged = merge_arrays([1, 2, 3], [4, 5, 6]);
 console.log(merged);
 
