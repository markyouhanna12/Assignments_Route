// Boyer Moore Majority Vote Algorithm

function majorityElements(nums){
    let count = 0
    let candidate = null
    for (let i = 0 ;i<nums.length; i++){
        let num = nums[i]
        if (count === 0){

            candidate = num
        }
    
    if(num === candidate){
        count++

    }else{
        count--
    }

}
    return candidate
}


candidate = majorityElements([2,2,1,1,1,2,2])
console.log(candidate);
