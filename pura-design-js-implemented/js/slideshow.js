// I create an array of my 4 image slides
const firstSlide = document.querySelector('img.image_1');
const secondSlide = document.querySelector('img.image_2');
const thirdSlide = document.querySelector('img.image_3');
const fourthSlide = document.querySelector('img.image_4');

const slideContainer = [firstSlide, secondSlide, thirdSlide, fourthSlide];

// Function which changes slides opacity from 1 to 0 and again. Assigning a variable to current slide array index

let currentSlideIndex = 0;
slideContainer[currentSlideIndex].style.opacity = '1';

function slideShow(){
    slideContainer[currentSlideIndex].style.opacity = '0';
    if (currentSlideIndex < slideContainer.length - 1){
        currentSlideIndex++;
    }else{
        currentSlideIndex = 0;
    }
    slideContainer[currentSlideIndex].style.opacity = '1';
};

// Set interval for slides changes

const intervalTime = 4000;
setInterval(slideShow, intervalTime);