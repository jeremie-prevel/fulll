/**
 * 
 *   - if number can be divided by 3: display Fizz.
 *   - if number can be divided by 5: display Buzz.
 *   - if number can be divided by 3 AND 5 : display FizzBuzz.
 *   - else: display the number.
 */
function fizzbuzz(val){
    let result ='';
    const isFizz = val % 3 ===0;
    const isBuzz = val % 5 ===0;

    if(!isFizz && !isBuzz){
        return val;
    }

    if(isFizz){
        result += 'Fizz';
    }

    if(isBuzz){
        result += 'Buzz';
    }

    return result;
}

function main(){
    const args = process.argv.slice(2);
    const [maxValue] = args;

    if(!args.length){
        throw 'Missing max number to evaluate for FizzBuzz';
    }
    if(isNaN(maxValue)){
        throw 'Value is not a number';
    }

    console.log(`values between 1 to ${maxValue}: `)
    for(let i=1; i <= maxValue; i++){
        const result = fizzbuzz(i);
        console.log(`${i}: ${result}`);
    }
}

main();
