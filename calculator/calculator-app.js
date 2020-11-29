// Calculator with operands and operator as an object.
// Podstawowym zagadnieniem jest stworzenie obiektu calculator, w którym zapisujemy wszystkie wyklikane liczby i operacje. 

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

// Funkcja dodająca separator dziesiętny. Sprawdza czy obiekt calculator posiada już element dot, jeśli nie, to dodaje go.

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
// Generalnie event listener przypisujemy całemu kontenerowi i okresleniami warunkowymi (przy pomocy .matches, które łapie elementy o określonej klasie) przypisujemy konkretnym typom przycisków konkretne działania, różne dla każdego typu. Wartością każdego kliknięcia jest event.target.innerHTML

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