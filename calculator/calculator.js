// Actions buttons
const acBtn = document.querySelector('.ac');
const delBtn = document.querySelector('.del');
const divideBtn = document.querySelector('.divide');
const multiplyBtn = document.querySelector('.multiply');
const minusBtn = document.querySelector('.minus');
const plusBtn = document.querySelector('.plus');
const sumBtn = document.querySelector('.sum');


// Making typing digits possible

const numbersButtons = document.querySelectorAll('.number');
const calculationsScreen = document.querySelector('.screen');
let calculations = '';

numbersButtons.forEach(numberButton =>{
    numberButton.addEventListener('click', () =>{
        calculations = Number(calculations + numberButton.innerHTML);
        calculationsScreen.innerHTML = calculations;
        // console.log(typeof(calculations))
        // console.log(calculations)
    })
})

console.log(calculations)





// oneBtn.addEventListener('click', () =>{
//     calculations = calculations + 1;
//     console.log(calculations)
//     calculationsScreen.innerHTML = Number(calculations);
//     console.log(typeof(calculations))
// })









// // Digits buttons
// const oneBtn = document.querySelector('.one');
// const twoBtn = document.querySelector('.two');
// const threeBtn = document.querySelector('.three');
// const fourBtn = document.querySelector('.four');
// const fiveBtn = document.querySelector('.five');
// const sixBtn = document.querySelector('.six');
// const sevenBtn = document.querySelector('.seven');
// const eightBtn = document.querySelector('.eight');
// const nineBtn = document.querySelector('.nine');
// const zeroBtn = document.querySelector('.zero');
// const dotBtn = document.querySelector('.dot');
