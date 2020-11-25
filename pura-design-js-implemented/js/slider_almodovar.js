const slideContainer = document.querySelector('.gallery');
const slideImages = document.querySelectorAll('.gallery div');
const prevBtn = document.querySelector('.prevBtn');
const nextBtn = document.querySelector('.nextBtn');

let counter = 1;
const imageSize = slideImages[0].clientWidth;
console.log(imageSize)

// slideImages[1].clientWidth = imageSize; 
// slideImages[2].clientWidth = imageSize; 
// slideImages[3].clientWidth = imageSize; 
// slideImages[4].clientWidth = imageSize; 


slideContainer.style.transform = 'translateX(' + (-imageSize * counter) + 'px)';

nextBtn.addEventListener('click', ()=>{
    slideContainer.style.transition = 'transform 0.4s ease-in-out';
    counter++;
    slideContainer.style.transform = 'translateX(' + (-imageSize * counter) + 'px)';
})

prevBtn.addEventListener('click', ()=>{
    slideContainer.style.transition = 'transform 0.4s ease-in-out';
    counter--;
    slideContainer.style.transform = 'translateX(' + (-imageSize * counter) + 'px)';
})

console.log(slideImages[0].clientWidth);
console.log(slideImages[1].clientWidth);
console.log(slideImages[2].clientWidth);
console.log(slideImages[3].clientWidth);
console.log(slideImages[4].clientWidth);
console.log(slideImages[5].clientWidth);
console.log(slideImages[6].clientWidth);
console.log(slideImages[7].clientWidth);
console.log(slideImages[8].clientWidth);
console.log(slideImages[9].clientWidth);
console.log(slideImages[10].clientWidth);
console.log(slideImages[11].clientWidth);
console.log(slideImages[12].clientWidth);
console.log(slideImages[13].clientWidth);
console.log(slideImages[14].clientWidth);
console.log(slideImages[15].clientWidth);
console.log(slideImages[16].clientWidth);