// Use a switch statement to return the day of the week 
// given a number (1 = Sunday …., 7 = Saturday).
// • Input Example: 2
// • Output Example: “Monday”

function getDayOfWeek(number){
    switch(number){
        case 1:
            return "Sunday";
        case 2:
            return "Monday";
        case 3:
            return "Tuesday";
        case 4:
            return "Wednesday";
        case 5:
            return "Thursday";
        case 6:
            return "Friday";
        case 7:
            return "Saturday";
    }
}
let day = getDayOfWeek(2);
console.log(day);