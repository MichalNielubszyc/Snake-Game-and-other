// Creating an object 'calculator' which has parameters such as operands, operator and screenValue

const calculator = {
    screenValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null
};

// Function which adds numbers from event.target to the 'object' parameter 'screenValue' 

function addNumber(number){
    // this changes the display on calculator screen , if there already is firstOperand, than replace it with secondOperand

// PROBLEMS!!!!!

    if (calculator.waitingForSecondOperand === true){
        calculator.screenValue = number;
        debugger
        calculator.waitingForSecondOperand = false;
    }else{
        // Explanation: Conditional (ternary) operator : a condition followed by a question mark (?), then an expression to execute if the condition is truthy followed by a colon (:), and finally the expression to execute if the condition is falsy.
        calculator.screenValue === '0' ? calculator.screenValue = number : calculator.screenValue = calculator.screenValue + number ;
    }
    // my old code, to be removed at the end
    // if(calculator.screenValue === '0'){
    //     calculator.screenValue = number;
    // }else if(calculator.waitingForSecondOperand === false){
    //     debugger
    //     calculator.screenValue = calculator.screenValue + number;
    // }
}

// Function whick adds decimal , first checking if decimals already is in calculator.screenValue

function addDecimal(dot){
    if(!calculator.screenValue.includes(dot)){
        // calculator.screenValue = calculator.screenValue + dot;
        calculator.screenValue += dot;
    }
}


// Function which organizes cooperation between first and second operand and operator

// 1st case - we click the operator after entering first number (firstOperand)

function handleOperator(nextOperator){
    // destructure propsów obiektu calculator
    const { firstOperand, screenValue, operator} = calculator;
    // using parseFloat change string calculator.screenValue into a number with decimals
    const inputValue = parseFloat(screenValue);

    // checking if firstOperand === null (should be if it's the first action) and if inputValue is a number
    if (firstOperand === null && !isNaN(inputValue)){
        calculator.firstOperand = inputValue;
        
    // checking if operator was clicked, then give the result
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);

// PROBLEMS!!!!!

        calculator.screenValue = String(result);
        calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;

    console.log(calculator);
}

// 2nd case - when the user has entered the second operand and we need to check which operator was entered

function calculate(firstOperand, secondOperand, operator){
    if (operator === '+'){
        return firstOperand + secondOperand;
    } else if ( operator === '-' ){
        return firstOperand - secondOperand;
    } else if ( operator === 'x'){
        return firstOperand * secondOperand;
    } else if ( operator === '/'){
        return firstOperand / secondOperand;
    }

    return secondOperand
}

// Function takes calculator.screenValue to the element holding display (screen) in html. calculator.screenValue is taken from event.listener -> event.target

function updateScreen(){
    const screen = document.querySelector('.screen');
    screen.innerHTML = calculator.screenValue;
}

// We give eventListener to the whole container and using 'if' statements and .matches (catching elements of certain class) we give specific types of buttons specific actions. The value of every click is event.target.innerHTML

const calculatorButtons = document.querySelector('.calculatorContainer');

calculatorButtons.addEventListener('click', (event) =>{
    //if clicked element is not a button - return
    if (!event.target.matches('button')){
        return;
    }
    if (event.target.matches('.operator')){
        debugger
        handleOperator(event.target.innerHTML);
        updateScreen();
    }
    //  not done yet
    // if (event.target.matches('.allClear')){
    //     return;
    // }
    if (event.target.matches('.decimal')){
        addDecimal(event.target.innerHTML)
        updateScreen()
    }else{
        // console.log('digit', event.target.innerHTML);    
        addNumber(event.target.innerHTML);
        updateScreen();
    }
    
})