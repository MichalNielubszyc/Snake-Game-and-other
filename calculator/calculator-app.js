// Calculator with operands and operator as an object

const calculator = {
    screenValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null
};

// Funkcja, która dodaje cyfry w screenValue w zależności czy dotychczas było tam 0 czy już jakaś cyfra. 

function addNumber(number){
    if(calculator.screenValue === '0'){
        calculator.screenValue = number;
    }else{
        calculator.screenValue = calculator.screenValue + number;
    }
}

// Funkcja dodająca separator dziesiętny

function addDecimal(dot){
    if(!calculator.screenValue.includes(dot)){
        // calculator.screenValue = calculator.screenValue + dot;
        calculator.screenValue += dot;
    }
}

// Updating the display

function updateScreen(){
    const screen = document.querySelector('.screen');
    screen.innerHTML = calculator.screenValue;
}

// Event Listener for all calculator buttons, using event delegation

const calculatorButtons = document.querySelector('.calculatorContainer');

calculatorButtons.addEventListener('click', (event) =>{
    //jeśli kliknięte pole nie jest buttonem, wyjdź z funkcji
    console.log(event.target)
    if (!event.target.matches('button')){
        return;
    }
    if (event.target.matches('.operator')){
        return;
    }
    if (event.target.matches('.allClear')){
        return;
    }
    if (event.target.matches('.decimal')){
        addDecimal(event.target.innerHTML)
        updateScreen()
    }else{
        // console.log('digit', event.target.innerHTML);    
        addNumber(event.target.innerHTML);
        updateScreen();
    }
    
})