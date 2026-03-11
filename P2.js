// Check if the given variable is falsy and return "Invalid" if it is.
// • Input Example: 0
// • Output Example: "Invalid

function checkValue(value){
    if(!value){
        return "Invalid";
    }
}

let check1 =checkValue(null) ;
let check2 =checkValue(false) ;
let check3 =checkValue(0) ;


console.log(check1);
console.log(check2);
console.log(check3);