function sum(a) {
    let accumulator = 0;

    function doSum(value) {
        if (typeof value === 'undefined') {
            return accumulator;
        }
        else {
            accumulator += value;

            return doSum;
        }
    }

    return doSum(a); 
}

console.log(sum());
console.log(sum(1)(2)(3)(4)(5)(6)());