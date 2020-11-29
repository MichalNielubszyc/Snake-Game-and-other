// Podstawowym zagadnieniem jest stworzenie obiektu calculator, w którym zapisujemy wszystkie wyklikane liczby i operacje. Obiekt posiada parametry jak operands i operator oraz screenValue

const calculator = {
    screenValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null
};

// Funkcja, która dodaje cyfry w screenValue w zależności czy dotychczas było tam 0 czy już jakaś cyfra. Nie potrafię obsługiwać wyrażeń z '?' dlatego wykonuję ze zwykłym wyrażeniem 'if else'

function addNumber(number){
    if(calculator.screenValue === '0'){
        calculator.screenValue = number;
    }else{
        calculator.screenValue = calculator.screenValue + number;
    }
    console.log(calculator);
}

// Funkcja dodająca separator dziesiętny. Sprawdza czy obiekt calculator posiada już element dot, jeśli nie, to dodaje go.

function addDecimal(dot){
    if(!calculator.screenValue.includes(dot)){
        // calculator.screenValue = calculator.screenValue + dot;
        calculator.screenValue += dot;
    }
}


// Funkcja, która obsługuje kliknięcia przycisków funkcyjnych (operatorów)

// 1 przypadek - naciskamy operator po wprowadzeniu pierwszej liczby (firstOperand)

function handleOperator(nextOperator){
    // destructure propsów obiektu calculator
    const { firstOperand, screenValue, operator} = calculator;
    // za pomocą parseFloat zmieniamy stringa przechowywanego w calculator.screenValue w liczbę z miejscami po przecinku
    const inputValue = parseFloat(screenValue);
    //sprawdzenie czy firstOperand jest null (powinien być jeśli to pierwsze działanie) oraz czy inputValue jest numberem
    if (firstOperand === null && !isNaN(inputValue)){
        calculator.firstOperand = inputValue;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;

    console.log(calculator);
}

// Funkcja służy do przerzucenia na display kalkulatora wartości screenValue, którą pobieram z obiektu calculator, do którego trafia ona z kolei na podstawie event.targetów 

function updateScreen(){
    const screen = document.querySelector('.screen');
    screen.innerHTML = calculator.screenValue;
}

// Generalnie event listener przypisujemy całemu kontenerowi i okresleniami warunkowymi (przy pomocy .matches, które łapie elementy o określonej klasie) przypisujemy konkretnym typom przycisków konkretne działania, różne dla każdego typu. Wartością każdego kliknięcia jest event.target.innerHTML

const calculatorButtons = document.querySelector('.calculatorContainer');

calculatorButtons.addEventListener('click', (event) =>{
    //jeśli kliknięte pole nie jest buttonem, wyjdź z funkcji
    console.log(event.target)
    if (!event.target.matches('button')){
        return;
    }
    if (event.target.matches('.operator')){
        handleOperator(event.target.innerHTML);
        updateScreen();
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